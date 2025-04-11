<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-4xl font-bold mb-8">{{ $t('blog.title') }}</h1>
    
    <div v-if="pending" class="flex justify-center py-12">
      <div class="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
    </div>
    
    <div v-else class="grid gap-8 md:grid-cols-2">
      <div v-for="post in posts" :key="post._path" class="card bg-card shadow-lg overflow-hidden">
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-2">{{ post.title }}</h2>
          <p class="text-muted-foreground mb-4">{{ formatDate(post.date) }}</p>
          <p class="mb-4">{{ post.description }}</p>
          <NuxtLink :to="`/${$i18n.locale}/blog${post._path}`" class="text-primary hover:underline font-medium">
            {{ $t('blog.readMore') }} →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['locale'],
})

// Fetch all blog posts
const { data: posts, pending } = await useAsyncData('blog-posts', () => {
  return queryContent('blog')
    .sort({ date: -1 })
    .find()
})

// Format date using date-fns
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
