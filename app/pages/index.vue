<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface LoginResponse {
  accessToken: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
}

const { t } = useI18n()
const router = useRouter()
const { public: { apiBaseUrl } } = useRuntimeConfig()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const data = await $fetch<LoginResponse>(`${apiBaseUrl}/auth/login`, {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })
    localStorage.setItem('accessToken', data.accessToken)
    router.push('/home')
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode
    if (status === 401) {
      error.value = t('login.errors.invalidCredentials')
    } else {
      error.value = t('login.errors.generic')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{{ t('login.title') }}</CardTitle>
        <CardDescription>{{ t('login.description') }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
          <div class="flex flex-col gap-2">
            <Label for="email">{{ t('login.email') }}</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              autocomplete="username"
              required
            />
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <Label for="password">{{ t('login.password') }}</Label>
              <NuxtLink to="/forgot-password" class="text-sm text-muted-foreground hover:underline">
                {{ t('login.forgotPassword') }}
              </NuxtLink>
            </div>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />
          </div>
          <p v-if="error" class="text-sm text-destructive text-center">{{ error }}</p>
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? t('login.submitting') : t('login.submit') }}
          </Button>
          <p class="text-center text-sm text-muted-foreground">
            {{ t('login.registerLink') }}
            <NuxtLink to="/register" class="text-foreground font-medium hover:underline">
              {{ t('login.register') }}
            </NuxtLink>
          </p>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
