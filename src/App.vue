<script setup>
import { ref } from 'vue'
import HeaderBar from './components/common/HeaderBar.vue'
import FooterBar from './components/common/FooterBar.vue'
import UploadSection from './components/pages/UploadSection.vue'
import Workspace from './components/pages/Workspace.vue'

const currentTab = ref('upload')

function handleDiveDataUploaded(data) {
  console.log('Dive data uploaded:', data)
}

function handleVideoUploaded(file) {
  console.log('Video uploaded:', file)
}
</script>

<template>
  <v-app>
    <HeaderBar />

    <v-main>
      <v-container fluid>
        <v-tabs v-model="currentTab" color="primary" align-tabs="center">
          <v-tab value="upload">
            <v-icon icon="mdi-upload" class="mr-2" />
            檔案上傳
          </v-tab>
          <v-tab value="workspace">
            <v-icon icon="mdi-view-dashboard" class="mr-2" />
            工作區
          </v-tab>
        </v-tabs>

        <v-window v-model="currentTab" class="mt-4">
          <v-window-item value="upload">
            <UploadSection
              @dive-data-uploaded="handleDiveDataUploaded"
              @video-uploaded="handleVideoUploaded"
            />
          </v-window-item>

          <v-window-item value="workspace">
            <Workspace />
          </v-window-item>
        </v-window>
      </v-container>
    </v-main>

    <FooterBar />
  </v-app>
</template>

<style scoped>
</style>
