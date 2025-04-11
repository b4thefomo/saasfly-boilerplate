<template>
  <div class="flex min-h-screen flex-col items-center justify-center text-center">
    <div class="space-y-6">
      <h1 class="text-6xl font-bold">{{ error?.statusCode || '404' }}</h1>
      <h2 class="text-2xl font-medium">
        {{ error?.message || $t('error.pageNotFound') }}
      </h2>
      <p class="text-muted-foreground">
        {{ $t('error.description') }}
      </p>
      <Button @click="handleError">
        {{ $t('error.backHome') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue';

// Get the error
const props = defineProps({
  error: Object
});

// Access head to set metadata
const head = useHead({
  title: `Error ${props.error?.statusCode || '404'} | SaasFly`,
});

// Handle error
const handleError = () => {
  // Clear the error
  clearError();
  
  // Navigate to home page
  return navigateTo('/');
};
</script>
