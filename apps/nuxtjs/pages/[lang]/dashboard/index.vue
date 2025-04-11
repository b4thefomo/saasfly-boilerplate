<template>
  <div class="container py-10">
    <h1 class="text-3xl font-bold mb-6">{{ $t('dashboard.title') }}</h1>
    
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Dashboard widgets will go here -->
      <Card class="col-span-1">
        <div class="p-6">
          <h3 class="text-lg font-medium mb-2">{{ $t('dashboard.welcomeCard.title') }}</h3>
          <p class="text-muted-foreground">
            {{ $t('dashboard.welcomeCard.description') }}
          </p>
        </div>
      </Card>
      
      <Card class="col-span-1">
        <div class="p-6">
          <h3 class="text-lg font-medium mb-2">{{ $t('dashboard.statsCard.title') }}</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-3xl font-bold">0</p>
              <p class="text-sm text-muted-foreground">{{ $t('dashboard.statsCard.projects') }}</p>
            </div>
            <div>
              <p class="text-3xl font-bold">0</p>
              <p class="text-sm text-muted-foreground">{{ $t('dashboard.statsCard.tasks') }}</p>
            </div>
          </div>
        </div>
      </Card>
      
      <Card class="col-span-1">
        <div class="p-6">
          <h3 class="text-lg font-medium mb-2">{{ $t('dashboard.subscriptionCard.title') }}</h3>
          <p class="text-muted-foreground mb-4">
            {{ $t('dashboard.subscriptionCard.status') }}: <span class="font-medium">Free</span>
          </p>
          <Button>{{ $t('dashboard.subscriptionCard.upgrade') }}</Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '~/components/ui/Card.vue';
import Button from '~/components/ui/Button.vue';

definePageMeta({
  middleware: ['auth']
});
</script>
