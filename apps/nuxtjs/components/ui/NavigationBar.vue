<template>
  <header class="sticky top-0 z-40 w-full border-b bg-background">
    <div class="container flex h-16 items-center justify-between py-4">
      <!-- Logo and app name -->
      <div class="flex items-center gap-2">
        <NuxtLink :to="`/${$i18n.locale}`" class="flex items-center gap-2">
          <div class="size-8 rounded-md bg-primary flex items-center justify-center">
            <span class="text-lg font-bold text-primary-foreground">S</span>
          </div>
          <span class="text-xl font-bold">SaasFly</span>
        </NuxtLink>
      </div>
      
      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-6">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.href"
          :to="localePath(item.href)"
          class="text-sm font-medium transition-colors hover:text-primary"
          :class="{ 'text-primary': isActive(item.href) }"
        >
          {{ $t(item.label) }}
        </NuxtLink>
      </nav>
      
      <!-- Auth and theme switching -->
      <div class="flex items-center gap-4">
        <!-- Theme toggle -->
        <ThemeToggle />
        
        <!-- Auth buttons -->
        <template v-if="!userStore.isAuthenticated">
          <NuxtLink :to="localePath('/auth/login')" class="text-sm font-medium hover:underline">
            {{ $t('nav.login') }}
          </NuxtLink>
          <Button
            size="sm"
            as-child
          >
            <NuxtLink :to="localePath('/auth/register')">
              {{ $t('nav.register') }}
            </NuxtLink>
          </Button>
        </template>
        
        <!-- User dropdown when authenticated -->
        <UserMenu v-else />
        
        <!-- Mobile menu button -->
        <Button 
          variant="ghost" 
          size="icon" 
          class="md:hidden" 
          @click="toggleMobileMenu"
        >
          <MenuIcon v-if="!isMobileMenuOpen" class="size-5" />
          <XIcon v-else class="size-5" />
        </Button>
      </div>
    </div>
    
    <!-- Mobile navigation menu -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden border-t"
    >
      <div class="container py-4">
        <nav class="flex flex-col gap-4">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.href"
            :to="localePath(item.href)"
            class="flex items-center py-2 text-sm font-medium transition-colors hover:text-primary"
            :class="{ 'text-primary': isActive(item.href) }"
            @click="isMobileMenuOpen = false"
          >
            {{ $t(item.label) }}
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '~/stores/user';
import { useRoute } from 'vue-router';
import MenuIcon from '~/components/icons/MenuIcon.vue';
import XIcon from '~/components/icons/XIcon.vue';
import Button from '~/components/ui/Button.vue';
import ThemeToggle from '~/components/ui/ThemeToggle.vue';
import UserMenu from '~/components/ui/UserMenu.vue';

// User store
const userStore = useUserStore();
const route = useRoute();
const { localePath } = useLocalePath();
const { t } = useI18n();

// Mobile menu state
const isMobileMenuOpen = ref(false);

// Navigation items
const navigationItems = [
  { href: '/', label: 'nav.home' },
  { href: '/features', label: 'nav.features' },
  { href: '/pricing', label: 'nav.pricing' },
  { href: '/docs', label: 'nav.docs' },
  { href: '/blog', label: 'nav.blog' }
];

// Check if route is active
const isActive = (path: string) => {
  return route.path.startsWith(localePath(path));
};

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>
