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

const identifier = ref('')
const password = ref('')

function handleLogin() {
  console.log('Login:', { identifier: identifier.value, password: password.value })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Digite seu usuário ou e-mail para acessar sua conta.</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
          <div class="flex flex-col gap-2">
            <Label for="identifier">E-mail</Label>
            <Input
              id="identifier"
              v-model="identifier"
              type="text"
              placeholder="seu@email.com"
              autocomplete="username"
              required
            />
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <Label for="password">Senha</Label>
              <NuxtLink to="/forgot-password" class="text-sm text-muted-foreground hover:underline">
                Esqueceu sua senha?
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
          <Button type="submit" class="w-full">
            Entrar
          </Button>
          <p class="text-center text-sm text-muted-foreground">
            Não tem uma conta?
            <NuxtLink to="/register" class="text-foreground font-medium hover:underline">
              Cadastre-se
            </NuxtLink>
          </p>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
