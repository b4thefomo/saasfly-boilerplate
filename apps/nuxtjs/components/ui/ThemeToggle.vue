<template>
  <div class="flex items-center">
    <Button
      variant="ghost"
      size="icon"
      @click="toggleTheme"
      aria-label="Toggle theme"
    >
      <SunIcon v-if="currentTheme === 'dark'" class="size-5" />
      <MoonIcon v-else-if="currentTheme === 'light'" class="size-5" />
      <ComputerIcon v-else class="size-5" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useColorMode } from '@vueuse/core';
import Button from '~/components/ui/Button.vue';
import SunIcon from '~/components/icons/SunIcon.vue';
import MoonIcon from '~/components/icons/MoonIcon.vue';
import ComputerIcon from '~/components/icons/ComputerIcon.vue';

const colorMode = useColorMode({
  attribute: 'data-theme',
  modes: {
    light: 'light',
    dark: 'dark',
    system: 'system'
  }
});

const currentTheme = computed(() => colorMode.value);

// Toggle between light, dark, and system
const toggleTheme = () => {
  if (currentTheme.value === 'light') {
    colorMode.value = 'dark';
  } else if (currentTheme.value === 'dark') {
    colorMode.value = 'system';
  } else {
    colorMode.value = 'light';
  }
  
  // Save preference
  localStorage.setItem('theme', colorMode.value);
};
</script>
