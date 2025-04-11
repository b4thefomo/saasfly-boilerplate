<template>
  <html :class="currentTheme">
    <body>
      <slot />
    </body>
  </html>
</template>

<script setup lang="ts">
import { useFontFace } from '@vueuse/core'

// Define theme type
type Theme = 'light' | 'dark' | 'system'

// Create reactive state for theme
const theme = ref<Theme>('system')
const currentTheme = computed(() => {
  if (theme.value === 'system') {
    // Check if user prefers dark mode
    if (process.client) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    }
    // Default for SSR
    return 'light'
  }
  return theme.value
})

// Register custom fonts
useFontFace({
  family: 'Cal Sans',
  src: [
    { url: '/assets/fonts/CalSans-SemiBold.woff2', format: 'woff2' }
  ],
  fontStyle: 'normal',
  fontWeight: '600'
})

// Set CSS variables for fonts
const root = ref(null)
onMounted(() => {
  document.documentElement.style.setProperty('--font-sans', 'Inter, sans-serif')
  document.documentElement.style.setProperty('--font-heading', '"Cal Sans", sans-serif')
})

// Load and apply user preference
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') as Theme | null
  if (savedTheme) {
    theme.value = savedTheme
  }
})

// Watch for theme changes
watch(theme, (newTheme) => {
  if (process.client) {
    localStorage.setItem('theme', newTheme)
  }
}, { immediate: true })

// Expose theme setter
const setTheme = (newTheme: Theme) => {
  theme.value = newTheme
}

// Provide theme context to components
provide('theme', {
  current: currentTheme,
  setTheme
})
</script>
