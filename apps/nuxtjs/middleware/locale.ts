// middleware/locale.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Get i18n instance
  const { locale, locales } = useI18n()
  
  // Skip if route already has locale
  if (to.params.lang) return
  
  // Determine preferred locale
  let preferredLocale = locale.value
  
  // Get browser/user preferred language if available
  const navigator = window.navigator
  if (navigator && navigator.language) {
    const browserLocale = navigator.language.split('-')[0]
    const availableLocales = locales.value.map((l: any) => l.code)
    
    if (availableLocales.includes(browserLocale)) {
      preferredLocale = browserLocale
    }
  }
  
  // Redirect to localized route
  return navigateTo({
    path: `/${preferredLocale}${to.fullPath}`,
    query: to.query,
    hash: to.hash
  })
})
