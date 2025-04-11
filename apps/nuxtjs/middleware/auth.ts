// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()
  
  // Skip middleware if the route doesn't require authentication
  if (to.meta.auth === false) {
    return
  }
  
  // If not authenticated, redirect to login
  if (!userStore.isAuthenticated) {
    // Store the intended destination for redirect after login
    const query = { from: to.fullPath }
    return navigateTo({ path: '/auth/login', query })
  }
})
