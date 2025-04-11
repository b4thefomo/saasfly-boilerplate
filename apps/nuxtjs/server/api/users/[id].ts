import { defineEventHandler, readBody, createError } from 'h3'
import { PrismaClient } from '@saasfly/db'
import { verifyToken } from '~/server/utils/auth'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Get authenticated user from token
  const authUser = await verifyToken(event)
  
  if (!authUser) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  
  // Get user ID from URL
  const id = event.context.params?.id
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }
  
  // Check if authenticated user is the requested user or an admin
  const isAuthorized = authUser.id === id || authUser.role === 'ADMIN'
  
  if (!isAuthorized) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden'
    })
  }
  
  const method = event.node.req.method
  
  // GET /api/users/[id]
  if (method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          image: true,
          // Only include sensitive fields if requesting own data
          ...(authUser.id === id ? {
            emailVerified: true,
            // Don't include password hash
          } : {})
        }
      })
      
      if (!user) {
        throw createError({
          statusCode: 404,
          message: 'User not found'
        })
      }
      
      return user
    } catch (error) {
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch user'
      })
    }
  }
  
  // PATCH /api/users/[id] - Update user
  if (method === 'PATCH') {
    try {
      const body = await readBody(event)
      const { name, email, password, role, image } = body
      
      // Prepare update data
      const updateData: any = {}
      
      if (name) updateData.name = name
      if (email) updateData.email = email
      if (password) updateData.password = await bcrypt.hash(password, 10)
      if (image) updateData.image = image
      
      // Only admins can update role
      if (role && authUser.role === 'ADMIN') {
        updateData.role = role
      }
      
      // Update user
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
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
      
      return updatedUser
    } catch (error) {
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        message: 'Failed to update user'
      })
    }
  }
  
  // DELETE /api/users/[id] - Delete user
  if (method === 'DELETE') {
    // Only admins or the user themselves can delete a user
    try {
      await prisma.user.delete({
        where: { id }
      })
      
      return { success: true, message: 'User deleted successfully' }
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: 'Failed to delete user'
      })
    }
  }
  
  // Throw error for unsupported methods
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
