<script setup>
import { useI18n } from 'vue-i18n'
import DiveLogUploader from './DiveLogUploader.vue'
import VideoUploader from './VideoUploader.vue'

const { t } = useI18n()
const emit = defineEmits(['diveDataUploaded', 'videoUploaded'])

function handleDiveDataUploaded(data) {
  emit('diveDataUploaded', data)
}

function handleVideoUploaded(file) {
  emit('videoUploaded', file)
}
</script>

<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 mb-2">
          <v-icon icon="mdi-upload" class="mr-2" />
          {{ t('upload.title') }}
        </h2>
        <p class="text-body-1 text-grey mb-6">
          {{ t('upload.description') }}
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <DiveLogUploader @dive-data-uploaded="handleDiveDataUploaded" />
      </v-col>
      <v-col cols="12" md="6">
        <VideoUploader @video-uploaded="handleVideoUploaded" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>
