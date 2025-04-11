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

  // GET /api/users - Get all users (admin only)
  if (method === 'GET') {
    // Check if user is admin
    if (user.role !== 'ADMIN') {
      throw createError({
        statusCode: 403,
        message: 'Forbidden'
      })
    }
    
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit
    
    try {
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            image: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.user.count()
      ])
      
      return {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch users'
      })
    }
  }
  
  // POST /api/users - Create a new user (admin only)
  if (method === 'POST') {
    // Check if user is admin
    if (user.role !== 'ADMIN') {
      throw createError({
        statusCode: 403,
        message: 'Forbidden'
      })
    }
    
    try {
      const body = await readBody(event)
      const { name, email, password, role } = body
      
      if (!name || !email || !password) {
        throw createError({
          statusCode: 400,
          message: 'Missing required fields'
        })
      }
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      
      if (existingUser) {
        throw createError({
          statusCode: 400,
          message: 'User with this email already exists'
        })
      }
      
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: await bcrypt.hash(password, 10),
          role: role || 'USER'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          image: true
        }
      })
      
      return newUser
    } catch (error) {
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        message: 'Failed to create user'
      })
    }
  }
  
  // Throw error for unsupported methods
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
