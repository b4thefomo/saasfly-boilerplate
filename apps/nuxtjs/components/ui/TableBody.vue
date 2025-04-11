<template>
  <tbody :class="['[&_tr:last-child]:border-0', className]">
    <slot />
  </tbody>
</template>

<script setup lang="ts">
defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>
