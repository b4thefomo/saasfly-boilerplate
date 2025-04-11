import { useUserStore } from '~/stores/user'
import type { User } from '~/types'

export function useUser() {
  const userStore = useUserStore()
  const { $api } = useNuxtApp()
  
  // Get current user
  const user = computed(() => userStore.user)
  
  // Check if user is authenticated
  const isAuthenticated = computed(() => userStore.isAuthenticated)
  
  // Check if user is admin
  const isAdmin = computed(() => userStore.user?.role === 'ADMIN')
  
  // Get loading state
  const loading = computed(() => userStore.loading)
  
  // Get error state
  const error = computed(() => userStore.error)
  
  // Fetch user profile
  const fetchProfile = async () => {
    try {
      if (!userStore.isAuthenticated) {
        return null
      }
      
      return await userStore.fetchUser()
    } catch (err) {
      console.error('Error fetching user profile:', err)
      return null
    }
  }
  
  // Update user profile
  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!userStore.isAuthenticated || !userStore.user) {
        throw new Error('User not authenticated')
      }
      
      return await $api.patch(`/api/users/${userStore.user.id}`, data)
    } catch (err) {
      console.error('Error updating user profile:', err)
      throw err
    }
  }
  
  // List users (admin only)
  const listUsers = async (page = 1, limit = 10) => {
    try {
      if (!isAdmin.value) {
        throw new Error('Unauthorized')
      }
      
      return await $api.get(`/api/users?page=${page}&limit=${limit}`)
    } catch (err) {
      console.error('Error listing users:', err)
      throw err
    }
  }
  
  // Get user by ID (admin only or self)
  const getUserById = async (id: string) => {
    try {
      if (!userStore.isAuthenticated) {
        throw new Error('User not authenticated')
      }
      
      if (!isAdmin.value && id !== userStore.user?.id) {
        throw new Error('Unauthorized')
      }
      
      return await $api.get(`/api/users/${id}`)
    } catch (err) {
      console.error(`Error getting user ${id}:`, err)
      throw err
    }
  }
  
  return {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    fetchProfile,
    updateProfile,
    listUsers,
    getUserById
  }
}
