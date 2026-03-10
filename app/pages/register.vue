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
      cepError.value = 'CEP não encontrado.'
      return
    }
    street.value = data.logradouro
    neighborhood.value = data.bairro
    city.value = data.localidade
    state.value = data.uf
  } catch {
    cepError.value = 'Erro ao buscar CEP.'
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
      submitError.value = message ?? 'Dado já cadastrado.'
    } else {
      submitError.value = 'Erro ao realizar cadastro. Tente novamente.'
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
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>Preencha os dados abaixo para se cadastrar.</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col gap-6" @submit.prevent="handleRegister">

          <!-- Dados pessoais -->
          <div class="flex flex-col gap-4">
            <p class="text-sm font-medium text-muted-foreground uppercase tracking-wide">Dados pessoais</p>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <Label for="firstName">Primeiro nome</Label>
                <Input id="firstName" v-model="firstName" type="text" placeholder="João" required />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="lastName">Sobrenome</Label>
                <Input id="lastName" v-model="lastName" type="text" placeholder="Silva" required />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <Label for="email">E-mail</Label>
                <Input id="email" v-model="email" type="email" placeholder="joao@email.com" required />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="phone">Telefone</Label>
                <Input
                  id="phone"
                  v-model="phone"
                  v-maska
                  data-maska="['(##) ####-####', '(##) #####-####']"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  inputmode="numeric"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <Label for="cpf">CPF</Label>
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
            <p class="text-sm font-medium text-muted-foreground uppercase tracking-wide">Endereço</p>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="flex flex-col gap-2">
                <Label for="cep">CEP</Label>
                <Input
                  id="cep"
                  v-model="cep"
                  v-maska="'#####-###'"
                  type="text"
                  placeholder="00000-000"
                  inputmode="numeric"
                  required
                />
                <p v-if="cepLoading" class="text-xs text-muted-foreground">Buscando...</p>
                <p v-if="cepError" class="text-xs text-destructive">{{ cepError }}</p>
              </div>
              <div class="flex flex-col gap-2 sm:col-span-2">
                <Label for="street">Rua</Label>
                <Input id="street" v-model="street" type="text" placeholder="Rua das Flores" required />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="flex flex-col gap-2">
                <Label for="number">Número</Label>
                <Input id="number" v-model="number" type="text" placeholder="123" required />
              </div>
              <div class="flex flex-col gap-2 sm:col-span-2">
                <Label for="complement">Complemento</Label>
                <Input id="complement" v-model="complement" type="text" placeholder="Apto 4B (opcional)" />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="flex flex-col gap-2">
                <Label for="neighborhood">Bairro</Label>
                <Input id="neighborhood" v-model="neighborhood" type="text" placeholder="Centro" required />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="city">Cidade</Label>
                <Input id="city" v-model="city" type="text" placeholder="São Paulo" required />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="state">Estado</Label>
                <Input id="state" v-model="state" type="text" placeholder="SP" maxlength="2" required />
              </div>
            </div>
          </div>

          <Separator />

          <!-- Senha -->
          <div class="flex flex-col gap-4">
            <p class="text-sm font-medium text-muted-foreground uppercase tracking-wide">Senha</p>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <Label for="password">Senha</Label>
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
                <Label for="confirmPassword">Confirmar senha</Label>
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
            {{ submitLoading ? 'Cadastrando...' : 'Criar conta' }}
          </Button>

          <p class="text-center text-sm text-muted-foreground">
            Já tem uma conta?
            <NuxtLink to="/" class="text-foreground font-medium hover:underline">
              Entrar
            </NuxtLink>
          </p>

        </form>
      </CardContent>
    </Card>
  </div>
</template>
