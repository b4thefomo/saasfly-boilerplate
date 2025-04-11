<template>
  <article class="max-w-3xl mx-auto py-12 px-4">
    <div v-if="pending" class="flex justify-center py-12">
      <div class="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
    </div>
    
    <template v-else-if="doc">
      <div class="mb-8">
        <NuxtLink :to="`/${$i18n.locale}/docs`" class="text-primary hover:underline mb-4 inline-block">
          ← {{ $t('docs.backToDocs') }}
        </NuxtLink>
        <h1 class="text-4xl font-bold mb-2">{{ doc.title }}</h1>
        <p v-if="doc.date" class="text-muted-foreground">{{ formatDate(doc.date) }}</p>
      </div>
      
      <ContentRenderer :value="doc" class="prose prose-lg dark:prose-invert max-w-none" />
    </template>
    
    <div v-else class="text-center py-12">
      <h2 class="text-2xl font-bold mb-4">{{ $t('docs.pageNotFound') }}</h2>
      <NuxtLink :to="`/${$i18n.locale}/docs`" class="text-primary hover:underline">
        {{ $t('docs.backToDocs') }}
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['locale']
})

const route = useRoute()
const slug = Array.isArray(route.params.slug) 
  ? route.params.slug.join('/') 
  : route.params.slug

// Fetch documentation page
const { data: doc, pending } = await useAsyncData(`doc-${slug}`, () => {
  return queryContent('docs', slug).findOne()
})

// Format date using Intl
const formatDate = (date: string) => {
  if (!date) return ''
  
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat(useI18n().locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj)
}
</script>
