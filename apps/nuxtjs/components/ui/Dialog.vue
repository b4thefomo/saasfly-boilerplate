<template>
  <Teleport to="body">
    <Transition name="dialog-transition">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-background/80 backdrop-blur-sm" 
          @click="$emit('update:modelValue', false)"
        ></div>
        <!-- Dialog content -->
        <div class="fixed z-50 grid w-full max-w-lg scale-100 gap-4 bg-background p-6 shadow-lg border rounded-lg">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.dialog-transition-enter-active,
.dialog-transition-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-transition-enter-from,
.dialog-transition-leave-to {
  opacity: 0;
}
</style>
