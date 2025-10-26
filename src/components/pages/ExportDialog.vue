<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useExportStore } from '@/stores/exportStore'
import { useDiveDataStore } from '@/stores/diveDataStore'
import { useVideoStore } from '@/stores/videoStore'
import { useSyncStore } from '@/stores/syncStore'
import { useOverlayStore } from '@/stores/overlayStore'

const { t } = useI18n()
const exportStore = useExportStore()
const diveDataStore = useDiveDataStore()
const videoStore = useVideoStore()
const syncStore = useSyncStore()
const overlayStore = useOverlayStore()

const emit = defineEmits(['close'])

const showDialog = ref(true)
const exportFileName = ref('dive-video-export')

// Computed
const canStartExport = computed(() => {
  return exportStore.isReady && 
         diveDataStore.hasDiveData && 
         videoStore.hasVideo
  // 移除 syncStore.isSynced 的限制，允許不調整時間軸也能匯出
})

const stepText = computed(() => {
  switch (exportStore.currentStep) {
    case 'loading': return t('export.steps.loading')
    case 'preparing': return t('export.steps.preparing')
    case 'rendering': return t('export.steps.rendering')
    case 'compositing': return t('export.steps.compositing')
    case 'done': return t('export.steps.done')
    case 'error': return t('export.steps.error')
    default: return t('export.steps.idle')
  }
})

const qualityOptions = computed(() => [
  { title: t('export.quality.low'), value: 'low' },
  { title: t('export.quality.medium'), value: 'medium' },
  { title: t('export.quality.high'), value: 'high' }
])

const resolutionOptions = computed(() => [
  { title: t('export.resolution.original'), value: 'original' },
  { title: '1920x1080 (Full HD)', value: '1920x1080' },
  { title: '1280x720 (HD)', value: '1280x720' }
])

// Methods
async function initializeFFmpeg() {
  if (!exportStore.isLoaded) {
    await exportStore.loadFFmpeg()
  }
}

async function startExport() {
  try {
    // Prepare overlay data
    const overlayData = prepareOverlayData()
    
    const config = {
      videoFile: videoStore.videoFile,
      overlayData,
      duration: videoStore.videoDuration,
      outputFileName: `${exportFileName.value}.mp4`
    }

    const result = await exportStore.exportVideo(config)
    
    // Auto download
    downloadFile(result.blob, config.outputFileName)
    
  } catch (error) {
    console.error('Export failed:', error)
  }
}

function prepareOverlayData() {
  const waypoints = diveDataStore.waypoints
  const offset = syncStore.timeOffset
  
  return waypoints.map(waypoint => ({
    timestamp: waypoint.divetime + offset,
    date: diveDataStore.date,
    diveNumber: diveDataStore.diveNumber,
    depth: waypoint.depth,
    temperature: waypoint.temperature,
    divetime: waypoint.divetime,
    descentRate: waypoint.descentRate,
    ascentRate: waypoint.ascentRate
  }))
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function closeDialog() {
  exportStore.reset()
  showDialog.value = false
  emit('close')
}

function handleCancel() {
  if (exportStore.isProcessing) {
    // In a real implementation, you might want to add cancellation support
    return
  }
  closeDialog()
}

// Lifecycle
onMounted(async () => {
  await initializeFFmpeg()
})

onUnmounted(() => {
  exportStore.cleanup()
})
</script>

<template>
  <v-dialog v-model="showDialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <v-icon icon="mdi-export" class="mr-2" />
        {{ t('export.title') }}
      </v-card-title>

      <v-card-text>
        <!-- Loading FFmpeg -->
        <div v-if="!exportStore.isLoaded && exportStore.currentStep === 'loading'">
          <div class="text-center mb-4">
            <v-icon icon="mdi-loading" class="animate-spin" size="48" color="primary" />
            <p class="mt-2">{{ t('export.loadingFFmpeg') }}</p>
          </div>
          <v-progress-linear 
            :model-value="exportStore.loadingProgress" 
            color="primary" 
            height="8" 
            rounded
          />
          <p class="text-caption text-center mt-2">
            {{ exportStore.loadingProgress.toFixed(0) }}%
          </p>
        </div>

        <!-- Export Settings -->
        <div v-else-if="exportStore.isReady && !exportStore.isProcessing">
          <v-alert type="info" variant="tonal" class="mb-4">
            {{ t('export.description') }}
          </v-alert>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="exportFileName"
                :label="t('export.fileName')"
                variant="outlined"
                density="compact"
                suffix=".mp4"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="exportStore.exportSettings.quality"
                :items="qualityOptions"
                :label="t('export.quality.title')"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="exportStore.exportSettings.resolution"
                :items="resolutionOptions"
                :label="t('export.resolution.title')"
                variant="outlined"
                density="compact"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="exportStore.exportSettings.frameRate"
                :label="t('export.frameRate')"
                type="number"
                min="24"
                max="60"
                variant="outlined"
                density="compact"
                suffix="fps"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="exportStore.exportSettings.videoBitrate"
                :label="t('export.bitrate')"
                variant="outlined"
                density="compact"
                suffix="kbps"
              />
            </v-col>
          </v-row>

          <!-- Export Info -->
          <v-card variant="tonal" class="mt-4">
            <v-card-text>
              <div class="text-subtitle-2 mb-2">{{ t('export.info.title') }}</div>
              <div class="text-body-2">
                <div>{{ t('export.info.video') }}: {{ videoStore.videoFile?.name }}</div>
                <div>{{ t('export.info.duration') }}: {{ Math.floor(videoStore.videoDuration) }}s</div>
                <div>{{ t('export.info.diveData') }}: {{ diveDataStore.waypoints.length }} {{ t('export.info.waypoints') }}</div>
                <div>{{ t('export.info.offset') }}: {{ syncStore.timeOffset }}s</div>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Export Progress -->
        <div v-else-if="exportStore.isProcessing">
          <div class="text-center mb-4">
            <v-icon icon="mdi-cog" class="animate-spin" size="48" color="primary" />
            <p class="mt-2">{{ stepText }}</p>
          </div>
          
          <v-progress-linear 
            :model-value="exportStore.progress" 
            color="primary" 
            height="8" 
            rounded
          />
          
          <p class="text-caption text-center mt-2">
            {{ exportStore.progressPercentage }}%
          </p>

          <div class="text-center mt-4">
            <p class="text-body-2 text-grey">
              {{ t('export.processing.message') }}
            </p>
          </div>
        </div>

        <!-- Export Complete -->
        <div v-else-if="exportStore.currentStep === 'done'">
          <div class="text-center">
            <v-icon icon="mdi-check-circle" size="64" color="success" />
            <p class="text-h6 mt-2">{{ t('export.complete.title') }}</p>
            <p class="text-body-2 text-grey">{{ t('export.complete.message') }}</p>
            
            <v-btn
              v-if="exportStore.downloadUrl"
              :href="exportStore.downloadUrl"
              :download="`${exportFileName}.mp4`"
              color="success"
              class="mt-4"
              prepend-icon="mdi-download"
            >
              {{ t('export.complete.download') }}
            </v-btn>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="exportStore.error">
          <v-alert type="error" class="mb-4">
            <div class="font-weight-bold">{{ t('export.error.title') }}</div>
            <div>{{ exportStore.error }}</div>
          </v-alert>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        
        <v-btn
          v-if="!exportStore.isProcessing"
          variant="text"
          @click="handleCancel"
        >
          {{ exportStore.currentStep === 'done' ? t('common.close') : t('common.cancel') }}
        </v-btn>
        
        <v-btn
          v-if="canStartExport && !exportStore.isProcessing && exportStore.currentStep !== 'done'"
          color="primary"
          @click="startExport"
        >
          {{ t('export.start') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>