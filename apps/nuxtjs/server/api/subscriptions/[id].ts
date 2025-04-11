import { defineEventHandler, readBody, createError } from 'h3'
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
  
  // Get subscription ID from URL
  const id = event.context.params?.id
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Subscription ID is required'
    })
  }
  
  const method = event.node.req.method
  
  // GET /api/subscriptions/[id]
  if (method === 'GET') {
    try {
      // Find the subscription
      const subscription = await prisma.subscription.findUnique({
        where: { id },
        include: {
          plan: true
        }
      })
      
      if (!subscription) {
        throw createError({
          statusCode: 404,
          message: 'Subscription not found'
        })
      }
      
      // Check if user is authorized to view this subscription
      const isAuthorized = subscription.userId === user.id || user.role === 'ADMIN'
      
      if (!isAuthorized) {
        throw createError({
          statusCode: 403,
          message: 'Forbidden'
        })
      }
      
      return subscription
    } catch (error) {
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch subscription'
      })
    }
  }
  
  // PATCH /api/subscriptions/[id] - Update subscription (e.g., cancel, change plan)
  if (method === 'PATCH') {
    try {
      // Find the subscription first
      const subscription = await prisma.subscription.findUnique({
        where: { id }
      })
      
      if (!subscription) {
        throw createError({
          statusCode: 404,
          message: 'Subscription not found'
        })
      }
      
      // Check if user is authorized to update this subscription
      const isAuthorized = subscription.userId === user.id || user.role === 'ADMIN'
      
      if (!isAuthorized) {
        throw createError({
          statusCode: 403,
          message: 'Forbidden'
        })
      }
      
      const body = await readBody(event)
      const { status, planId } = body
      
      // Update data
      const updateData: any = {}
      
      if (status) {
        updateData.status = status
        
        // If cancelling, set cancellation date
        if (status === 'CANCELED') {
          updateData.canceledAt = new Date()
        }
      }
      
      // Change plan if requested (in a real app, this would involve payment provider logic)
      if (planId) {
        // Verify plan exists
        const plan = await prisma.plan.findUnique({
          where: { id: planId }
        })
        
        if (!plan) {
          throw createError({
            statusCode: 404,
            message: 'Plan not found'
          })
        }
        
        updateData.planId = planId
        
        // Reset billing period for new plan
        updateData.currentPeriodStart = new Date()
        updateData.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
      
      // Update subscription
      const updatedSubscription = await prisma.subscription.update({
        where: { id },
        data: updateData,
        include: {
          plan: true
        }
      })
      
      return updatedSubscription
    } catch (error) {
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        message: 'Failed to update subscription'
      })
    }
  }
  
  // DELETE /api/subscriptions/[id] - Cancel subscription immediately
  if (method === 'DELETE') {
    try {
      // Find the subscription first
      const subscription = await prisma.subscription.findUnique({
        where: { id }
      })
      
      if (!subscription) {
        throw createError({
          statusCode: 404,
          message: 'Subscription not found'
        })
      }
      
      // Check if user is authorized to delete this subscription
      const isAuthorized = subscription.userId === user.id || user.role === 'ADMIN'
      
      if (!isAuthorized) {
        throw createError({
          statusCode: 403,
          message: 'Forbidden'
        })
      }
      
      // In a real app, you'd typically soft-delete by updating status rather than hard deleting
      const updatedSubscription = await prisma.subscription.update({
        where: { id },
        data: {
          status: 'CANCELED',
          canceledAt: new Date()
        }
      })
      
      return { success: true, message: 'Subscription canceled successfully' }
    } catch (error) {
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        message: 'Failed to cancel subscription'
      })
    }
  }
  
  // Throw error for unsupported methods
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
