<template>
  <div :class="['grid gap-2', className]">
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
