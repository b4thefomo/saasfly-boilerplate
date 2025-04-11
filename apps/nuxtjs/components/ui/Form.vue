<template>
  <form :class="className" @submit.prevent="$emit('submit')">
    <slot />
  </form>
</template>

<script setup lang="ts">
defineProps({
  className: {
    type: String,
    default: ''
  }
})

defineEmits(['submit'])
</script>
