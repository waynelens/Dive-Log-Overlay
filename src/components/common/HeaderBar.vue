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

// ensure public assets work when deployed to a subpath
const base = import.meta.env.BASE_URL || '/' 

</script>

<template>
  <v-app-bar prominent flat elevation="0" class="app-bar-borders">
    <v-app-bar-title>
  <v-img :src="base + 'icon2.png'" max-width="32" max-height="32" class="mr-2 d-inline-block" style="vertical-align: middle;" />
      Dive Log Overlay Tool
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
/* light top and bottom border for app bar */
.app-bar-borders {
  border-top: 1px solid rgba(0,0,0,0.08);
  border-bottom: 1px solid rgba(0,0,0,0.08);
}
</style>
