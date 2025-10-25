<script setup>
import { useI18n } from 'vue-i18n'
import { setLocale, getCurrentLocale } from '@/plugins/i18n'
import { ref } from 'vue'
import icon from '@/assets/icon.png'

const { t } = useI18n()
const currentLocale = ref(getCurrentLocale())

function changeLocale(locale) {
  setLocale(locale)
  currentLocale.value = locale
}

</script>

<template>
  <v-app-bar prominent flat elevation="0" class="app-bar-borders">

    <v-row class="align-center no-gutters">
    <v-col cols="auto">
      <v-img
        :src="icon"
        width="32"
        height="32"
        class="ml-3"
      />
    </v-col>
    <v-col cols="auto" class="pl-0">
      <span>Dive Log Overlay Tool</span>
    </v-col>
  </v-row>

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
