<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-4xl font-bold mb-8">{{ $t('docs.title') }}</h1>
    
    <div v-if="pending" class="flex justify-center py-12">
      <div class="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
    </div>
    
    <div v-else class="grid gap-8">
      <div v-for="doc in docs" :key="doc._path" class="card bg-card shadow-lg">
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-2">{{ doc.title }}</h2>
          <p class="mb-4">{{ doc.description }}</p>
          <NuxtLink :to="`/${$i18n.locale}/docs${doc._path}`" class="text-primary hover:underline font-medium">
            {{ $t('docs.readDoc') || 'Read documentation' }} →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['locale']
})

// Fetch all documentation pages
const { data: docs, pending } = await useAsyncData('documentation-pages', () => {
  return queryContent('docs')
    .sort({ title: 1 })
    .find()
})
</script>
