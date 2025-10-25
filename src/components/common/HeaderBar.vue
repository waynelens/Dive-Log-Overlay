<script setup>
import { useI18n } from 'vue-i18n'
import { setLocale, getCurrentLocale } from '@/plugins/i18n'
import { ref } from 'vue'
import icon from '@/assets/icon.png'

const { t } = useI18n()
const currentLocale = ref(getCurrentLocale())

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
      <v-btn icon="mdi-earth" @click="toggleLocale" />
      <v-btn icon="mdi-github" href="https://github.com/waynelens/Dive-Log-Overlay" target="_blank" />
    </template>
  </v-app-bar>
</template>

<style scoped>
/* light top and bottom border for app bar */
.app-bar-borders {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
