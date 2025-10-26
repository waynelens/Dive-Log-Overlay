<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const currentYear = new Date().getFullYear()

const links = computed(() => [
  { name: t('footer.links.github'), url: 'https://github.com/waynelens/Dive-Log-Overlay' },
])
</script>

<template>
  <v-footer class="text-center d-flex flex-column">
    <div class="pt-4">
      <v-btn v-for="link in links" :key="link.name" class="mx-2" variant="text" :href="link.url" target="_blank">
        {{ link.name }}
      </v-btn>
    </div>

    <v-divider class="my-4" />

    <div class="pb-4">
      {{ t('footer.copyright', { year: currentYear }) }}
      <div class="text-caption text-medium-emphasis">
        {{ t('footer.description') }}
      </div>
    </div>
  </v-footer>
</template>

<style scoped></style>
