<script setup lang="ts">
import { Button } from '@/components/ui/button'

const { t, locale, locales, setLocale } = useI18n()

function toggleLocale() {
  const next = locale.value === 'pt' ? 'en' : 'pt'
  setLocale(next)
}

const currentLocaleName = computed(() => {
  const current = locales.value.find((l) => l.code === locale.value)
  return current?.name ?? locale.value
})
</script>

<template>
  <Button
    variant="outline"
    :aria-label="t('languageSwitcher.ariaLabel')"
    @click="toggleLocale"
  >
    {{ currentLocaleName }}
  </Button>
</template>
