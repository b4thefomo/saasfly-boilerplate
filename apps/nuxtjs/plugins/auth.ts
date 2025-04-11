// plugins/auth.ts
import { defineNuxtPlugin } from '#app'
import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin(async (nuxtApp) => {
  const userStore = useUserStore()
  
  // Initialize auth state on app startup
  await userStore.initialize()
  
  return {
    provide: {
      auth: {
        // Auth helper methods
        login: userStore.login,
        logout: userStore.logout,
        register: userStore.register,
        getCurrentUser: userStore.getCurrentUser,
        isAuthenticated: () => userStore.isAuthenticated,
        isAdmin: () => userStore.isAdmin
      }
    }
  }
})
