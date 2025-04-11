<template>
  <thead :class="['[&_tr]:border-b', className]">
    <slot />
  </thead>
</template>

<script setup lang="ts">
defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>
