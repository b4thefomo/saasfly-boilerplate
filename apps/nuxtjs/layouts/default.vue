<template>
  <div class="flex min-h-screen flex-col">
    <header class="border-b">
      <div class="container flex h-16 items-center justify-between py-4">
        <div class="flex gap-6 md:gap-10">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="font-heading inline-block text-xl font-bold">SaasFly</span>
          </NuxtLink>
        </div>
        <!-- Navigation will go here -->
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t py-6 md:py-0">
      <div class="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {{ new Date().getFullYear() }} SaasFly. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Default layout script
</script>
