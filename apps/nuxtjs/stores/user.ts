// stores/user.ts
import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name?: string
  image?: string
  isAdmin: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),
  
  getters: {
    isAdmin: (state) => state.user?.isAdmin || false,
    getCurrentUser: (state) => state.user
  },
  
  actions: {
    async initialize() {
      this.loading = true
      try {
        // Fetch current session from API
        const { data } = await useFetch('/api/auth/session')
        
        if (data.value && data.value.user) {
          this.user = data.value.user as User
          this.isAuthenticated = true
        }
      } catch (error) {
        this.error = 'Failed to initialize auth'
        console.error('Auth initialization error:', error)
      } finally {
        this.loading = false
      }
    },
    
    async login(credentials: { email: string; password: string }) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await useFetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        })
        
        if (error.value) {
          this.error = error.value.statusMessage || 'Login failed'
          return false
        }
        
        if (data.value && data.value.user) {
          this.user = data.value.user as User
          this.isAuthenticated = true
          return true
        }
        
        return false
      } catch (error) {
        this.error = 'Login failed'
        console.error('Login error:', error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      this.loading = true
      
      try {
        await useFetch('/api/auth/logout', {
          method: 'POST'
        })
        
        this.user = null
        this.isAuthenticated = false
        
        // Redirect to home page after logout
        navigateTo('/')
      } catch (error) {
        this.error = 'Logout failed'
        console.error('Logout error:', error)
      } finally {
        this.loading = false
      }
    },
    
    async register(userData: { name: string; email: string; password: string }) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await useFetch('/api/auth/register', {
          method: 'POST',
          body: userData
        })
        
        if (error.value) {
          this.error = error.value.statusMessage || 'Registration failed'
          return false
        }
        
        if (data.value && data.value.user) {
          this.user = data.value.user as User
          this.isAuthenticated = true
          return true
        }
        
        return false
      } catch (error) {
        this.error = 'Registration failed'
        console.error('Registration error:', error)
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
