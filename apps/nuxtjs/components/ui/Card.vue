<template>
  <div :class="['rounded-lg border bg-card text-card-foreground shadow-sm', className]">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
/* Card related styles can be added here if needed */
</style>
