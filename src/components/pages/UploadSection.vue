<script setup>
import DiveLogUploader from './DiveLogUploader.vue'
import VideoUploader from './VideoUploader.vue'

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
          檔案上傳
        </h2>
        <p class="text-body-1 text-grey mb-6">
          請先上傳潛水記錄（UDDF 格式）和影片檔案，然後進入工作區進行時間軸對齊與疊加處理
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
