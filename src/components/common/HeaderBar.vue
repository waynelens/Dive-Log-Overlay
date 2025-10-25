<script setup>
import { useI18n } from 'vue-i18n'
import { setLocale, getCurrentLocale } from '@/plugins/i18n'
import { useThemeStore } from '@/stores/themeStore'
import { ref } from 'vue'
import icon from '@/assets/icon.png'

const { t } = useI18n()
const currentLocale = ref(getCurrentLocale())
const themeStore = useThemeStore()

function toggleLocale() {
  const newLocale = currentLocale.value === 'zh-TW' ? 'en-US' : 'zh-TW'
  setLocale(newLocale)
  currentLocale.value = newLocale
}

</script>

<template>
  <v-app-bar prominent flat elevation="0" class="app-bar-borders">

    <v-row class="align-center no-gutters">
      <v-col cols="auto">
        <v-img :src="icon" width="32" height="32" class="ml-3" />
      </v-col>
      <v-col cols="auto" class="pl-0">
        <span>Dive Log Overlay Tool</span>
      </v-col>
    </v-row>

    <template #append>
      <!-- Dark Mode Toggle -->
      <v-btn :icon="themeStore.isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'" @click="themeStore.toggleTheme" />

      <!-- Language Toggle -->
      <v-btn icon="mdi-earth" @click="toggleLocale" />

      <!-- GitHub Link -->
      <v-btn icon="mdi-github" href="https://github.com/waynelens/Dive-Log-Overlay" target="_blank" />
    </template>
  </v-app-bar>
</template>

<style scoped>
/* Border that adapts to theme */
.app-bar-borders {
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
