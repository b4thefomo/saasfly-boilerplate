<template>
  <div>
    <section class="py-20">
      <div class="container">
        <div class="max-w-3xl space-y-4">
          <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            {{ $t('home.hero.title') }}
          </h1>
          <p class="text-xl text-muted-foreground">
            {{ $t('home.hero.description') }}
          </p>
          <div class="flex flex-col gap-4 sm:flex-row">
            <Button @click="navigateTo(`/${$i18n.locale}/auth/register`)">
              {{ $t('home.hero.getStarted') }}
            </Button>
            <Button variant="outline" @click="navigateTo(`/${$i18n.locale}/docs`)">
              {{ $t('home.hero.learnMore') }}
            </Button>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-muted/40">
      <div class="container">
        <div class="grid gap-8 md:grid-cols-3">
          <div class="space-y-2">
            <h3 class="text-xl font-bold">{{ $t('home.features.feature1.title') }}</h3>
            <p class="text-muted-foreground">{{ $t('home.features.feature1.description') }}</p>
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-bold">{{ $t('home.features.feature2.title') }}</h3>
            <p class="text-muted-foreground">{{ $t('home.features.feature2.description') }}</p>
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-bold">{{ $t('home.features.feature3.title') }}</h3>
            <p class="text-muted-foreground">{{ $t('home.features.feature3.description') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20">
      <div class="container">
        <div class="mx-auto max-w-3xl text-center">
          <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl">
            {{ $t('home.cta.title') }}
          </h2>
          <p class="mt-4 text-muted-foreground">
            {{ $t('home.cta.description') }}
          </p>
          <div class="mt-8">
            <Button @click="navigateTo(`/${$i18n.locale}/auth/register`)">
              {{ $t('home.cta.button') }}
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue';

definePageMeta({
  middleware: ['locale'],
  layout: 'default'
});
</script>
