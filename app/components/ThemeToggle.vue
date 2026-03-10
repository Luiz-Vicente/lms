<script setup lang="ts">
import { SunIcon, MoonIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <Button variant="outline" size="icon" aria-label="Alternar tema" @click="toggleTheme">
    <SunIcon v-if="colorMode.value === 'dark'" class="h-4 w-4" />
    <MoonIcon v-else class="h-4 w-4" />
  </Button>
</template>
