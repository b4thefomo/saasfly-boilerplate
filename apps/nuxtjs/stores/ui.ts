import { defineStore } from 'pinia'

export interface UIState {
  sidebar: {
    isOpen: boolean
    activeItem: string | null
  }
  mobileMenu: {
    isOpen: boolean
  }
  theme: 'light' | 'dark' | 'system'
  toast: {
    isVisible: boolean
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    duration: number
  }
  modal: {
    isOpen: boolean
    component: string | null
    props: Record<string, any>
  }
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    sidebar: {
      isOpen: true,
      activeItem: null
    },
    mobileMenu: {
      isOpen: false
    },
    theme: 'system',
    toast: {
      isVisible: false,
      message: '',
      type: 'info',
      duration: 3000
    },
    modal: {
      isOpen: false,
      component: null,
      props: {}
    }
  }),
  
  actions: {
    // Sidebar actions
    toggleSidebar() {
      this.sidebar.isOpen = !this.sidebar.isOpen
    },
    setSidebarItem(item: string | null) {
      this.sidebar.activeItem = item
    },
    
    // Mobile menu actions
    toggleMobileMenu() {
      this.mobileMenu.isOpen = !this.mobileMenu.isOpen
    },
    closeMobileMenu() {
      this.mobileMenu.isOpen = false
    },
    
    // Theme actions
    setTheme(theme: 'light' | 'dark' | 'system') {
      this.theme = theme
      localStorage.setItem('theme', theme)
      
      // Apply theme to document
      const html = document.documentElement
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.setAttribute('data-theme', 'dark')
      } else {
        html.setAttribute('data-theme', 'light')
      }
    },
    
    // Initialize theme based on saved preference
    initTheme() {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
      if (savedTheme) {
        this.setTheme(savedTheme)
      } else {
        this.setTheme('system')
      }
    },
    
    // Toast actions
    showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) {
      this.toast = {
        isVisible: true,
        message,
        type,
        duration
      }
      
      // Auto hide toast after duration
      setTimeout(() => {
        this.hideToast()
      }, duration)
    },
    hideToast() {
      this.toast.isVisible = false
    },
    
    // Modal actions
    openModal(component: string, props: Record<string, any> = {}) {
      this.modal = {
        isOpen: true,
        component,
        props
      }
    },
    closeModal() {
      this.modal.isOpen = false
      // Reset after close animation
      setTimeout(() => {
        this.modal.component = null
        this.modal.props = {}
      }, 300)
    }
  }
})
