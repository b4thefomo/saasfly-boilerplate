// tailwind.config.ts
import type { Config } from 'tailwindcss'
import tailwindConfig from '@saasfly/tailwind-config'

export default {
  // Extend the shared tailwind config
  ...tailwindConfig,
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)']
      }
    }
  }
} satisfies Config
