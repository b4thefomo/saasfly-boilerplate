<template>
  <div class="relative">
    <Button
      variant="ghost"
      class="relative size-8 rounded-full"
      @click="isOpen = !isOpen"
    >
      <div v-if="userStore.user?.image" class="size-8 overflow-hidden rounded-full">
        <img
          :src="userStore.user.image"
          alt="User avatar"
          class="size-full object-cover"
        />
      </div>
      <div
        v-else
        class="flex size-8 items-center justify-center rounded-full bg-muted"
      >
        <span class="text-sm font-medium">
          {{ userInitials }}
        </span>
      </div>
    </Button>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-background p-2 shadow-lg ring-1 ring-black/5 focus:outline-none"
        @keydown.tab="closeOnTabOut"
        @keydown.esc="isOpen = false"
      >
        <div class="border-b pb-2 pt-1">
          <div class="px-2 py-1.5">
            <p class="truncate text-sm font-medium">{{ userStore.user?.name }}</p>
            <p class="truncate text-xs text-muted-foreground">{{ userStore.user?.email }}</p>
          </div>
        </div>
        <div class="py-1">
          <NuxtLink
            v-for="(item, i) in menuItems"
            :key="i"
            :ref="(el) => (i === 0 ? (firstMenuItem = el as any) : null)"
            :to="localePath(item.href)"
            class="block w-full px-2 py-1.5 text-left text-sm hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none"
            :class="item.variant === 'destructive' ? 'text-destructive' : ''"
            @click="isOpen = false"
          >
            {{ $t(item.label) }}
          </NuxtLink>
        </div>
        <div class="border-t pt-2">
          <button
            class="flex w-full items-center px-2 py-1.5 text-left text-sm text-destructive hover:bg-muted focus:bg-muted focus:outline-none"
            @click="logout"
          >
            {{ $t('nav.logout') }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core';
import Button from '~/components/ui/Button.vue';

// User store and router
const userStore = useUserStore();
const router = useRouter();
const { localePath } = useLocalePath();

// Menu state
const isOpen = ref(false);
const menuRef = ref(null);
const firstMenuItem = ref(null);

// User initials for avatar fallback
const userInitials = computed(() => {
  if (!userStore.user?.name) return '?';
  return userStore.user.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

// Menu items
const menuItems = [
  { href: '/account', label: 'nav.account' },
  { href: '/dashboard', label: 'nav.dashboard' },
  { href: '/settings', label: 'nav.settings' },
];

// Close menu when clicked outside
onClickOutside(menuRef, () => {
  isOpen.value = false;
});

// Focus first menu item when opened
watch(isOpen, async (value) => {
  if (value) {
    await nextTick();
    firstMenuItem.value?.focus();
  }
});

// Close on tab out
const closeOnTabOut = (e: KeyboardEvent) => {
  if (e.key === 'Tab' && !e.shiftKey) {
    const menuItems = document.querySelectorAll('.menu-item');
    const lastMenuItem = menuItems[menuItems.length - 1];
    if (document.activeElement === lastMenuItem) {
      isOpen.value = false;
    }
  }
};

// Logout
const logout = async () => {
  await userStore.logout();
  isOpen.value = false;
  router.push(localePath('/'));
};
</script>
