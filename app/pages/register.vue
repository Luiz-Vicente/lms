<script setup lang="ts">
import { ref, watch } from 'vue'
import { vMaska } from 'maska/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ViaCEPResponse {
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

const { t } = useI18n()
const router = useRouter()
const { public: { apiBaseUrl } } = useRuntimeConfig()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const cpf = ref('')
const cep = ref('')
const street = ref('')
const number = ref('')
const complement = ref('')
const neighborhood = ref('')
const city = ref('')
const state = ref('')
const password = ref('')
const confirmPassword = ref('')

const cepLoading = ref(false)
const cepError = ref('')
const submitLoading = ref(false)
const submitError = ref('')

watch(cep, (val) => {
  cepError.value = ''
  if (val.replace(/\D/g, '').length === 8) {
    fetchAddress(val)
  }
})

async function fetchAddress(cepValue: string) {
  const digits = cepValue.replace(/\D/g, '')
  cepLoading.value = true
  cepError.value = ''
  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
    const data: ViaCEPResponse = await res.json()
    if (data.erro) {
      cepError.value = t('register.cep.notFound')
      return
    }
    street.value = data.logradouro
    neighborhood.value = data.bairro
    city.value = data.localidade
    state.value = data.uf
  } catch {
    cepError.value = t('register.cep.error')
  } finally {
    cepLoading.value = false
  }
}

async function handleRegister() {
  submitError.value = ''
  submitLoading.value = true
  try {
    await $fetch(`${apiBaseUrl}/users`, {
      method: 'POST',
      body: {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phone: phone.value,
        cpf: cpf.value.replace(/\D/g, ''),
        zipCode: cep.value.replace(/\D/g, ''),
        street: street.value,
        number: number.value,
        complement: complement.value || undefined,
        neighborhood: neighborhood.value,
        city: city.value,
        state: state.value,
        password: password.value,
      },
    })
    router.push('/')
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode
    const message = (err as { data?: { message?: string } }).data?.message
    if (status === 409) {
      submitError.value = message ?? t('register.errors.conflict')
    } else {
      submitError.value = t('register.errors.generic')
    }
  } finally {
    submitLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4 py-10">
    <Card class="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{{ t('register.title') }}</CardTitle>
        <CardDescription>{{ t('register.description') }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col gap-6" @submit.prevent="handleRegister">

          <!-- Dados pessoais -->
          <div class="flex flex-col gap-4">
            <p class="text-sm font-medium text-muted-foreground uppercase tracking-wide">{{ t('register.sections.personalData') }}</p>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <Label for="firstName">{{ t('register.fields.firstName') }}</Label>
                <Input id="firstName" v-model="firstName" type="text" :placeholder="t('register.placeholders.firstName')" required />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="lastName">{{ t('register.fields.lastName') }}</Label>
                <Input id="lastName" v-model="lastName" type="text" :placeholder="t('register.placeholders.lastName')" required />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <Label for="email">{{ t('register.fields.email') }}</Label>
                <Input id="email" v-model="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="phone">{{ t('register.fields.phone') }}</Label>
                <Input
                  id="phone"
                  v-model="phone"
                  v-maska
                  data-maska="['(##) ####-####', '(##) #####-####']"
                  type="tel"
                  :placeholder="t('register.placeholders.phone')"
                  inputmode="numeric"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <Label for="cpf">{{ t('register.fields.cpf') }}</Label>
                <Input
                  id="cpf"
                  v-model="cpf"
                  v-maska="'###.###.###-##'"
                  type="text"
                  placeholder="000.000.000-00"
                  inputmode="numeric"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          <!-- Endereço -->
          <div class="flex flex-col gap-4">
            <p class="text-sm font-medium text-muted-foreground uppercase tracking-wide">{{ t('register.sections.address') }}</p>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="flex flex-col gap-2">
                <Label for="cep">{{ t('register.fields.cep') }}</Label>
                <Input
                  id="cep"
                  v-model="cep"
                  v-maska="'#####-###'"
                  type="text"
                  placeholder="00000-000"
                  inputmode="numeric"
                  required
                />
                <p v-if="cepLoading" class="text-xs text-muted-foreground">{{ t('register.cep.loading') }}</p>
                <p v-if="cepError" class="text-xs text-destructive">{{ cepError }}</p>
              </div>
              <div class="flex flex-col gap-2 sm:col-span-2">
                <Label for="street">{{ t('register.fields.street') }}</Label>
                <Input id="street" v-model="street" type="text" :placeholder="t('register.placeholders.street')" required />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="flex flex-col gap-2">
                <Label for="number">{{ t('register.fields.number') }}</Label>
                <Input id="number" v-model="number" type="text" :placeholder="t('register.placeholders.number')" required />
              </div>
              <div class="flex flex-col gap-2 sm:col-span-2">
                <Label for="complement">{{ t('register.fields.complement') }}</Label>
                <Input id="complement" v-model="complement" type="text" :placeholder="t('register.placeholders.complement')" />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="flex flex-col gap-2">
                <Label for="neighborhood">{{ t('register.fields.neighborhood') }}</Label>
                <Input id="neighborhood" v-model="neighborhood" type="text" :placeholder="t('register.placeholders.neighborhood')" required />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="city">{{ t('register.fields.city') }}</Label>
                <Input id="city" v-model="city" type="text" :placeholder="t('register.placeholders.city')" required />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="state">{{ t('register.fields.state') }}</Label>
                <Input id="state" v-model="state" type="text" :placeholder="t('register.placeholders.state')" maxlength="2" required />
              </div>
            </div>
          </div>

          <Separator />

          <!-- Senha -->
          <div class="flex flex-col gap-4">
            <p class="text-sm font-medium text-muted-foreground uppercase tracking-wide">{{ t('register.sections.password') }}</p>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <Label for="password">{{ t('register.fields.password') }}</Label>
                <Input
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  required
                />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="confirmPassword">{{ t('register.fields.confirmPassword') }}</Label>
                <Input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  required
                />
              </div>
            </div>
          </div>

          <p v-if="submitError" class="text-sm text-destructive text-center">{{ submitError }}</p>

          <Button type="submit" class="w-full" :disabled="submitLoading">
            {{ submitLoading ? t('register.submitting') : t('register.submit') }}
          </Button>

          <p class="text-center text-sm text-muted-foreground">
            {{ t('register.loginLink') }}
            <NuxtLink to="/" class="text-foreground font-medium hover:underline">
              {{ t('register.login') }}
            </NuxtLink>
          </p>

        </form>
      </CardContent>
    </Card>
  </div>
</template>
