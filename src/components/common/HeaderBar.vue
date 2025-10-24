<script setup>
import { useI18n } from 'vue-i18n'
import { setLocale, getCurrentLocale } from '@/plugins/i18n'
import { ref } from 'vue'

const { t } = useI18n()
const currentLocale = ref(getCurrentLocale())

function changeLocale(locale) {
  setLocale(locale)
  currentLocale.value = locale
}
</script>

<template>
  <v-app-bar color="primary" prominent>
    <v-app-bar-title>
      <v-icon icon="mdi-diving-scuba-flag" class="mr-2" />
      {{ t('header.title') }}
    </v-app-bar-title>

    <template #append>
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-translate" v-bind="props" />
        </template>
        <v-list>
          <v-list-item @click="changeLocale('zh-TW')">
            <v-list-item-title>繁體中文</v-list-item-title>
          </v-list-item>
          <v-list-item @click="changeLocale('en-US')">
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon="mdi-github" href="https://github.com/waynelens/Dive-Log-Overlay" target="_blank" />
    </template>
  </v-app-bar>
</template>

<style scoped>
</style>
