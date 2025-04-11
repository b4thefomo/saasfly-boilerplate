<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="w-full max-w-md space-y-8 p-8">
      <div class="text-center">
        <h1 class="text-2xl font-bold">{{ $t('auth.login') }}</h1>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ $t('auth.signInToContinue') }}
        </p>
      </div>
      
      <div v-if="error" class="rounded-md bg-destructive/15 p-4 text-destructive">
        {{ error }}
      </div>
      
      <Form @submit="handleSubmit" class="space-y-6">
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
          <div class="flex items-center justify-between">
            <Label for="password">{{ $t('auth.password') }}</Label>
            <NuxtLink 
              :to="`/${$i18n.locale}/auth/forgot-password`" 
              class="text-sm font-medium text-primary hover:underline"
            >
              {{ $t('auth.forgotPassword') }}
            </NuxtLink>
          </div>
          <Input 
            id="password" 
            v-model="password" 
            type="password" 
            :placeholder="$t('auth.passwordPlaceholder')"
            required
          />
        </FormField>
        
        <Button type="submit" class="w-full" :loading="loading">
          {{ $t('auth.signIn') }}
        </Button>
      </Form>
      
      <div class="mt-6 text-center text-sm">
        {{ $t('auth.noAccount') }}
        <NuxtLink 
          :to="`/${$i18n.locale}/auth/register`" 
          class="font-medium text-primary hover:underline"
        >
          {{ $t('auth.register') }}
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
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

// Get route and user store
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// Handle form submission
const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const success = await userStore.login({
      email: email.value,
      password: password.value
    });
    
    if (success) {
      // Redirect to the intended destination or dashboard
      const redirectPath = route.query.from as string || `/${useI18n().locale.value}/dashboard`;
      router.push(redirectPath);
    } else {
      error.value = userStore.error || 'Login failed. Please check your credentials.';
    }
  } catch (err) {
    error.value = 'An error occurred during login.';
    console.error('Login error:', err);
  } finally {
    loading.value = false;
  }
};
</script>
