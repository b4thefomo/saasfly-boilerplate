import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import NavigationBar from '../NavigationBar.vue'

// Mock user store
vi.mock('~/stores/user', () => ({
  useUserStore: () => ({
    isAuthenticated: false,
    user: null
  })
}))

// Mock i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: { value: 'en' }
  })
}))

// Mock composables
vi.mock('#imports', () => ({
  useLocalePath: () => ({ localePath: (path: string) => `/en${path}` }),
  useI18n: () => ({ 
    t: (key: string) => key,
    locale: { value: 'en' }
  }),
  useRoute: () => ({
    path: '/en'
  })
}))

describe('NavigationBar component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('renders correctly with navigation items', async () => {
    const wrapper = mount(NavigationBar, {
      global: {
        stubs: {
          'NuxtLink': true,
          'ThemeToggle': true,
          'UserMenu': true,
          'Button': true
        }
      }
    })
    
    await flushPromises()
    
    // Check navigation items render
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.text()).toContain('SaasFly')
    
    // Check navigation links
    const navLinks = wrapper.findAll('nav:first-of-type nuxtlink-stub')
    expect(navLinks.length).toBeGreaterThan(0)
  })
  
  it('shows login and register buttons when user is not authenticated', async () => {
    const wrapper = mount(NavigationBar, {
      global: {
        stubs: {
          'NuxtLink': true,
          'ThemeToggle': true,
          'UserMenu': true,
          'Button': true
        }
      }
    })
    
    await flushPromises()
    
    // Check auth buttons for unauthenticated users
    expect(wrapper.find('nuxtlink-stub[to="/en/auth/login"]').exists()).toBe(true)
    expect(wrapper.find('nuxtlink-stub[to="/en/auth/register"]').exists()).toBe(true)
    expect(wrapper.find('usermenu-stub').exists()).toBe(false)
  })
  
  it('toggles mobile menu when button is clicked', async () => {
    const wrapper = mount(NavigationBar, {
      global: {
        stubs: {
          'NuxtLink': true,
          'ThemeToggle': true,
          'UserMenu': true,
          'MenuIcon': true,
          'XIcon': true
        }
      }
    })
    
    await flushPromises()
    
    // Mobile menu should be hidden initially
    expect(wrapper.find('div.md\\:hidden.border-t').exists()).toBe(false)
    
    // Click the toggle button
    await wrapper.find('button.md\\:hidden').trigger('click')
    
    // Mobile menu should be visible
    expect(wrapper.find('div.md\\:hidden.border-t').exists()).toBe(true)
  })
})
