import { defineEventHandler, readBody, getQuery, createError } from 'h3'
import { PrismaClient } from '@saasfly/db'
import { verifyToken } from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Get authenticated user from token
  const user = await verifyToken(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  
  const method = event.node.req.method

  // GET /api/subscriptions - Get user subscriptions or all subscriptions (admin)
  if (method === 'GET') {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit
    
    try {
      // If admin, can get all subscriptions with filters
      if (user.role === 'ADMIN') {
        const [subscriptions, total] = await Promise.all([
          prisma.subscription.findMany({
            skip,
            take: limit,
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          }),
          prisma.subscription.count()
        ])
        
        return {
          subscriptions,
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
          }
        }
      } else {
        // Regular users can only see their own subscriptions
        const [subscriptions, total] = await Promise.all([
          prisma.subscription.findMany({
            where: {
              userId: user.id
            },
            skip,
            take: limit,
            orderBy: {
              createdAt: 'desc'
            }
          }),
          prisma.subscription.count({
            where: {
              userId: user.id
            }
          })
        ])
        
        return {
          subscriptions,
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
          }
        }
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch subscriptions'
      })
    }
  }
  
  // POST /api/subscriptions - Create a new subscription
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const { planId, paymentMethodId } = body
      
      if (!planId) {
        throw createError({
          statusCode: 400,
          message: 'Plan ID is required'
        })
      }
      
      // Get the plan
      const plan = await prisma.plan.findUnique({
        where: { id: planId }
      })
      
      if (!plan) {
        throw createError({
          statusCode: 404,
          message: 'Plan not found'
        })
      }
      
      // Check if user already has an active subscription
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          userId: user.id,
          status: 'ACTIVE'
        }
      })
      
      if (existingSubscription) {
        throw createError({
          statusCode: 400,
          message: 'User already has an active subscription'
        })
      }
      
      // Create subscription (in a real app, this would integrate with a payment provider like Stripe)
      const subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          planId,
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          // In a real app, store payment method info and handle payment
          paymentMethodId: paymentMethodId || null
        }
      })
      
      return subscription
    } catch (error) {
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        message: 'Failed to create subscription'
      })
    }
  }
  
  // Throw error for unsupported methods
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
