<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVideoStore } from '@/stores/videoStore'

const { t } = useI18n()
const emit = defineEmits(['videoUploaded'])

const videoStore = useVideoStore()
const isDragging = ref(false)
const fileName = ref('')

const acceptedFormats = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

function handleFileDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    processFile(file)
  }
}

function processFile(file) {
  // Validate file type
  if (!acceptedFormats.includes(file.type)) {
    alert(t('upload.video.error'))
    return
  }

  fileName.value = file.name
  videoStore.setLoading(true)

  try {
    videoStore.setVideoFile(file)
    emit('videoUploaded', file)
  } catch (error) {
    console.error('Error loading video:', error)
    videoStore.setError(error.message)
    alert(t('upload.video.loadError', { error: error.message }))
  } finally {
    videoStore.setLoading(false)
  }
}

function handleDragOver(event) {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}
</script>

<template>
  <v-card
    class="upload-card"
    :class="{ 'drag-over': isDragging }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop.prevent="handleFileDrop"
  >
    <v-card-title>
      <v-icon icon="mdi-video" class="mr-2" />
      {{ t('upload.video.title') }}
    </v-card-title>

    <v-card-text>
      <div class="upload-area text-center">
        <v-icon icon="mdi-video-plus" size="64" color="primary" class="mb-4" />
        
        <p class="text-h6 mb-2">{{ t('upload.video.dragText') }}</p>
        <p class="text-caption text-grey mb-4">{{ t('upload.video.formats') }}</p>

        <input
          ref="fileInput"
          type="file"
          accept="video/*"
          style="display: none"
          @change="handleFileSelect"
        />

        <v-btn
          color="primary"
          prepend-icon="mdi-video-box"
          @click="$refs.fileInput.click()"
        >
          {{ t('upload.video.selectButton') }}
        </v-btn>

        <div v-if="videoStore.isLoading" class="mt-4">
          <v-progress-circular indeterminate color="primary" />
          <p class="text-caption mt-2">{{ t('upload.video.loading') }}</p>
        </div>

        <div v-if="fileName && videoStore.hasVideo" class="mt-4">
          <v-alert type="success" variant="tonal">
            {{ t('upload.video.success', { filename: fileName }) }}
          </v-alert>

          <div v-if="videoStore.videoUrl" class="mt-4">
            <video
              :src="videoStore.videoUrl"
              class="preview-video"
              controls
              @loadedmetadata="(e) => videoStore.setVideoDuration(e.target.duration)"
            />
          </div>
        </div>

        <v-alert v-if="videoStore.error" type="error" class="mt-4" variant="tonal">
          {{ videoStore.error }}
        </v-alert>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.upload-card {
  height: 100%;
  transition: all 0.3s;
}

.upload-card.drag-over {
  border: 2px dashed #1976D2;
  background-color: rgba(25, 118, 210, 0.05);
}

.upload-area {
  padding: 2rem;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.preview-video {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}
</style>
