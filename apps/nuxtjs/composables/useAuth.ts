import { useUserStore } from '~/stores/user'

export function useAuth() {
  const userStore = useUserStore()
  const router = useRouter()
  const { t } = useI18n()
  const { localePath } = useLocalePath()
  
  // Login function
  const login = async (credentials: { email: string; password: string }) => {
    return await userStore.login(credentials)
  }
  
  // Register function
  const register = async (userData: { name: string; email: string; password: string }) => {
    return await userStore.register(userData)
  }
  
  // Logout function
  const logout = async () => {
    await userStore.logout()
    router.push(localePath('/'))
  }
  
  // Verify whether the user has access to a specific route
  const verifyAccess = (requiredRole?: 'USER' | 'ADMIN') => {
    // Check authentication
    if (!userStore.isAuthenticated) {
      return false
    }
    
    // If role is required, check it
    if (requiredRole && userStore.user?.role !== requiredRole) {
      return false
    }
    
    return true
  }
  
  // Redirect to login if not authenticated
  const requireAuth = (to: string, requiredRole?: 'USER' | 'ADMIN') => {
    if (!verifyAccess(requiredRole)) {
      const loginPath = localePath('/auth/login')
      router.push(`${loginPath}?from=${encodeURIComponent(to)}`)
      return false
    }
    
    return true
  }
  
  // Request password reset
  const requestPasswordReset = async (email: string) => {
    try {
      const response = await $fetch('/api/auth/forgot-password', {
        method: 'POST',
        body: { email }
      })
      
      return response
    } catch (error) {
      console.error('Password reset request error:', error)
      throw error
    }
  }
  
  // Reset password with token
  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/reset-password', {
        method: 'POST',
        body: { token, password }
      })
      
      return response
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }
  
  // Check if auth is loading
  const loading = computed(() => userStore.loading)
  
  // Get auth error
  const error = computed(() => userStore.error)
  
  return {
    login,
    register,
    logout,
    verifyAccess,
    requireAuth,
    requestPasswordReset,
    resetPassword,
    loading,
    error
  }
}
