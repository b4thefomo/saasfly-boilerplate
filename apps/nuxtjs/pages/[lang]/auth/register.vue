<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="w-full max-w-md space-y-8 p-8">
      <div class="text-center">
        <h1 class="text-2xl font-bold">{{ $t('auth.register') }}</h1>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ $t('auth.createAccount') }}
        </p>
      </div>
      
      <div v-if="error" class="rounded-md bg-destructive/15 p-4 text-destructive">
        {{ error }}
      </div>
      
      <Form @submit="handleSubmit" class="space-y-6">
        <FormField>
          <Label for="name">{{ $t('auth.name') }}</Label>
          <Input 
            id="name" 
            v-model="name" 
            type="text" 
            :placeholder="$t('auth.namePlaceholder')"
            required
          />
        </FormField>
        
        <FormField>
          <Label for="email">{{ $t('auth.email') }}</Label>
          <Input 
            id="email" 
            v-model="email" 
            type="email" 
            :placeholder="$t('auth.emailPlaceholder')"
            required
          />
        </FormField>
        
        <FormField>
          <Label for="password">{{ $t('auth.password') }}</Label>
          <Input 
            id="password" 
            v-model="password" 
            type="password" 
            :placeholder="$t('auth.passwordPlaceholder')"
            required
          />
        </FormField>
        
        <Button type="submit" class="w-full" :loading="loading">
          {{ $t('auth.register') }}
        </Button>
      </Form>
      
      <div class="mt-6 text-center text-sm">
        {{ $t('auth.alreadyHaveAccount') }}
        <NuxtLink 
          :to="`/${$i18n.locale}/auth/login`" 
          class="font-medium text-primary hover:underline"
        >
          {{ $t('auth.signIn') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '~/stores/user';
import Form from '~/components/ui/Form.vue';
import FormField from '~/components/ui/FormField.vue';
import Input from '~/components/ui/Input.vue';
import Label from '~/components/ui/Label.vue';
import Button from '~/components/ui/Button.vue';

definePageMeta({
  middleware: ['locale'],
  auth: false
});

// Form state
const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

// Get route and user store
const router = useRouter();
const userStore = useUserStore();

// Handle form submission
const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const success = await userStore.register({
      name: name.value,
      email: email.value,
      password: password.value
    });
    
    if (success) {
      // Redirect to dashboard after successful registration
      router.push(`/${useI18n().locale.value}/dashboard`);
    } else {
      error.value = userStore.error || 'Registration failed. Please try again.';
    }
  } catch (err) {
    error.value = 'An error occurred during registration.';
    console.error('Registration error:', err);
  } finally {
    loading.value = false;
  }
};
</script>
