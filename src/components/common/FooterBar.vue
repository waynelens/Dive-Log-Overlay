<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <v-footer color="grey-lighten-4" class="text-center d-flex flex-column">
    <div class="pt-4">
      <v-btn
        v-for="link in links"
        :key="link.name"
        class="mx-2"
        variant="text"
        :href="link.url"
        target="_blank"
      >
        {{ link.name }}
      </v-btn>
    </div>

    <v-divider class="my-4" />

    <div class="pb-4">
      {{ currentYear }} — <strong>Dive Log Overlay Tool</strong>
      <div class="text-caption text-grey">
        使用 Vue 3 + Vuetify 建構 | 支援 UDDF 格式潛水記錄
      </div>
    </div>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      links: [
        { name: '使用說明', url: '#' },
        { name: 'GitHub', url: 'https://github.com' },
        { name: '關於', url: '#' },
      ],
    }
  },
}
</script>

<style scoped>
</style>
