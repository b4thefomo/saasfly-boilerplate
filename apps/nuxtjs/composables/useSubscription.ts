import { useUserStore } from '~/stores/user'
import type { Subscription, Plan } from '~/types'

export function useSubscription() {
  const userStore = useUserStore()
  const { $api } = useNuxtApp()
  
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Get current user subscription
  const getCurrentSubscription = async () => {
    if (!userStore.isAuthenticated) {
      return null
    }
    
    loading.value = true
    error.value = null
    
    try {
      const { data } = await useFetch('/api/subscriptions', {
        method: 'GET',
        params: {
          limit: 1
        }
      })
      
      // Return the most recent active subscription if exists
      if (data.value?.subscriptions?.length > 0) {
        const activeSubscription = data.value.subscriptions.find(
          (sub: Subscription) => sub.status === 'ACTIVE'
        )
        return activeSubscription || null
      }
      
      return null
    } catch (err: any) {
      error.value = err.message || 'Failed to get subscription'
      console.error('Error fetching subscription:', err)
      return null
    } finally {
      loading.value = false
    }
  }
  
  // Get all available plans
  const getPlans = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await useFetch('/api/plans')
      return data.value?.plans || []
    } catch (err: any) {
      error.value = err.message || 'Failed to get plans'
      console.error('Error fetching plans:', err)
      return []
    } finally {
      loading.value = false
    }
  }
  
  // Subscribe to a plan
  const subscribe = async (planId: string, paymentMethodId?: string) => {
    if (!userStore.isAuthenticated) {
      throw new Error('User not authenticated')
    }
    
    loading.value = true
    error.value = null
    
    try {
      const { data } = await useFetch('/api/subscriptions', {
        method: 'POST',
        body: {
          planId,
          paymentMethodId
        }
      })
      
      return data.value
    } catch (err: any) {
      error.value = err.message || 'Failed to create subscription'
      console.error('Error creating subscription:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Cancel a subscription
  const cancelSubscription = async (subscriptionId: string) => {
    if (!userStore.isAuthenticated) {
      throw new Error('User not authenticated')
    }
    
    loading.value = true
    error.value = null
    
    try {
      const { data } = await useFetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        body: {
          status: 'CANCELED'
        }
      })
      
      return data.value
    } catch (err: any) {
      error.value = err.message || 'Failed to cancel subscription'
      console.error('Error canceling subscription:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Check if user has an active subscription
  const hasActiveSubscription = async () => {
    const subscription = await getCurrentSubscription()
    return !!subscription && subscription.status === 'ACTIVE'
  }
  
  // Check if the user has access to a specific feature
  const hasAccess = async (featureKey: string) => {
    const subscription = await getCurrentSubscription()
    
    if (!subscription || subscription.status !== 'ACTIVE') {
      return false
    }
    
    // Get the subscription plan with features
    const { data: planData } = await useFetch(`/api/plans/${subscription.planId}`)
    const plan = planData.value
    
    if (!plan || !plan.features) {
      return false
    }
    
    // Check if the feature is included in the plan
    return plan.features.includes(featureKey)
  }
  
  return {
    loading: readonly(loading),
    error: readonly(error),
    getCurrentSubscription,
    getPlans,
    subscribe,
    cancelSubscription,
    hasActiveSubscription,
    hasAccess
  }
}
