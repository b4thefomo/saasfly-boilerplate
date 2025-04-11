// server/api/auth/[...].ts
import { defineEventHandler, readBody, setCookie, getCookie, createError, sendRedirect } from 'h3'
import { prisma } from '@saasfly/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Auth token configuration
const JWT_SECRET = process.env.NUXT_AUTH_SECRET || 'your-secret-key'
const TOKEN_EXPIRY = '7d'
const COOKIE_NAME = 'auth_token'

// Helper functions
const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  )
}

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export default defineEventHandler(async (event) => {
  const path = event.path || ''
  const endpoint = path.split('/').pop()
  
  // Login handler
  if (endpoint === 'login') {
    try {
      const body = await readBody(event)
      const { email, password } = body
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      })
      
      if (!user) {
        throw createError({
          statusCode: 401,
          message: 'Invalid credentials'
        })
      }
      
      // Check password
      const validPassword = await bcrypt.compare(password, user.hashedPassword || '')
      
      if (!validPassword) {
        throw createError({
          statusCode: 401,
          message: 'Invalid credentials'
        })
      }
      
      // Generate token
      const token = generateToken(user)
      
      // Set cookie
      setCookie(event, COOKIE_NAME, token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production'
      })
      
      // Return user data (without password)
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          isAdmin: user.isAdmin
        }
      }
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Login failed'
      })
    }
  }
  
  // Logout handler
  if (endpoint === 'logout') {
    // Clear the auth cookie
    setCookie(event, COOKIE_NAME, '', {
      httpOnly: true,
      path: '/',
      maxAge: 0
    })
    
    return { success: true }
  }
  
  // Register handler
  if (endpoint === 'register') {
    try {
      const body = await readBody(event)
      const { name, email, password } = body
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      
      if (existingUser) {
        throw createError({
          statusCode: 400,
          message: 'User already exists'
        })
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)
      
      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          hashedPassword,
          emailVerified: new Date(),
        }
      })
      
      // Generate token
      const token = generateToken(user)
      
      // Set cookie
      setCookie(event, COOKIE_NAME, token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production'
      })
      
      // Return user data
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin || false
        }
      }
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Registration failed'
      })
    }
  }
  
  // Session handler
  if (endpoint === 'session') {
    try {
      // Get token from cookie
      const token = getCookie(event, COOKIE_NAME)
      
      if (!token) {
        return { user: null }
      }
      
      // Verify token
      const decoded = verifyToken(token) as any
      
      if (!decoded || !decoded.id) {
        return { user: null }
      }
      
      // Get user
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      })
      
      if (!user) {
        return { user: null }
      }
      
      // Return user data
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          isAdmin: user.isAdmin
        }
      }
    } catch (error) {
      console.error('Session error:', error)
      return { user: null }
    }
  }
  
  // Default handler (for unknown routes)
  throw createError({
    statusCode: 404,
    message: 'Not found'
  })
})
