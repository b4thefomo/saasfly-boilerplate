// middleware/admin.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()
  
  // Check if user is authenticated
  if (!userStore.isAuthenticated) {
    // Store the intended destination for redirect after login
    const query = { from: to.fullPath }
    return navigateTo({ path: '/auth/login', query })
  }
  
  // Check if user is admin
  if (!userStore.isAdmin) {
    // Redirect to dashboard if not admin
    return navigateTo('/dashboard')
  }
})
