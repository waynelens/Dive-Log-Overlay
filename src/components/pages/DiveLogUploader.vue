<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDiveDataStore } from '@/stores/diveDataStore'
import { parseUDDFFile } from '@/utils/uddfParser'

const { t } = useI18n()
const emit = defineEmits(['diveDataUploaded'])

const diveDataStore = useDiveDataStore()
const isDragging = ref(false)
const fileName = ref('')

async function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    await processFile(file)
  }
}

async function handleFileDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    await processFile(file)
  }
}

async function processFile(file) {
  // Validate file extension
  if (!file.name.toLowerCase().endsWith('.uddf')) {
    alert(t('upload.diveLog.error'))
    return
  }

  fileName.value = file.name
  diveDataStore.setLoading(true)

  try {
    const parsedData = await parseUDDFFile(file)
    diveDataStore.setRawData(file)
    diveDataStore.setParsedData(parsedData)
    emit('diveDataUploaded', parsedData)
  } catch (error) {
    console.error('Error parsing UDDF file:', error)
    diveDataStore.setError(error.message)
    alert(t('upload.diveLog.parseError', { error: error.message }))
  } finally {
    diveDataStore.setLoading(false)
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
  <v-card class="upload-card" :class="{ 'drag-over': isDragging }" @dragover="handleDragOver"
    @dragleave="handleDragLeave" @drop.prevent="handleFileDrop">
    <v-card-title>
      <v-icon icon="mdi-file-chart" class="mr-2" />
      {{ t('upload.diveLog.title') }}
    </v-card-title>

    <v-card-text>
      <div class="upload-area text-center">
        <v-icon icon="mdi-cloud-upload" size="64" color="primary" class="mb-4" />

        <p class="text-h6 mb-2">{{ t('upload.diveLog.dragText') }}</p>
        <p class="text-caption text-grey mb-4">{{ t('upload.diveLog.selectText') }}</p>

        <input ref="fileInput" type="file" accept=".uddf" style="display: none" @change="handleFileSelect" />

        <v-btn color="primary" prepend-icon="mdi-file-upload" @click="$refs.fileInput.click()">
          {{ t('upload.diveLog.selectButton') }}
        </v-btn>

        <div v-if="diveDataStore.isLoading" class="mt-4">
          <v-progress-circular indeterminate color="primary" />
          <p class="text-caption mt-2">{{ t('upload.diveLog.parsing') }}</p>
        </div>

        <div v-if="fileName && diveDataStore.hasDiveData" class="mt-4">
          <v-alert type="success" variant="tonal">
            {{ t('upload.diveLog.success', { filename: fileName }) }}
          </v-alert>

          <v-list density="compact" class="mt-2">
            <v-list-item>
              <template #prepend>
                <v-icon icon="mdi-calendar" />
              </template>
              <v-list-item-title>{{ t('upload.diveLog.stats.date') }}</v-list-item-title>
              <v-list-item-subtitle>{{ diveDataStore.date || '-' }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon icon="mdi-counter" />
              </template>
              <v-list-item-title>{{ t('upload.diveLog.stats.diveNumber') }}</v-list-item-title>
              <v-list-item-subtitle>#{{ diveDataStore.diveNumber }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon icon="mdi-clock-outline" />
              </template>
              <v-list-item-title>{{ t('upload.diveLog.stats.duration') }}</v-list-item-title>
              <v-list-item-subtitle
                >{{ diveDataStore.diveDuration }} {{ t('upload.diveLog.stats.seconds') }}</v-list-item-subtitle
              >
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon icon="mdi-arrow-down" />
              </template>
              <v-list-item-title>{{ t('upload.diveLog.stats.maxDepth') }}</v-list-item-title>
              <v-list-item-subtitle
                >{{ diveDataStore.maxDepth.toFixed(1) }} {{ t('upload.diveLog.stats.meters') }}</v-list-item-subtitle
              >
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon icon="mdi-thermometer" />
              </template>
              <v-list-item-title>{{ t('upload.diveLog.stats.minTemp') }}</v-list-item-title>
              <v-list-item-subtitle
                >{{ diveDataStore.minTemperature.toFixed(1) }}
                {{ t('upload.diveLog.stats.celsius') }}</v-list-item-subtitle
              >
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon icon="mdi-arrow-down-bold" />
              </template>
              <v-list-item-title>{{ t('upload.diveLog.stats.maxDescentRate') }}</v-list-item-title>
              <v-list-item-subtitle
                >{{ diveDataStore.maxDescentRate.toFixed(1) }}
                {{ t('upload.diveLog.stats.metersPerMinute') }}</v-list-item-subtitle
              >
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon icon="mdi-arrow-up-bold" />
              </template>
              <v-list-item-title>{{ t('upload.diveLog.stats.maxAscentRate') }}</v-list-item-title>
              <v-list-item-subtitle
                >{{ diveDataStore.maxAscentRate.toFixed(1) }}
                {{ t('upload.diveLog.stats.metersPerMinute') }}</v-list-item-subtitle
              >
            </v-list-item>
          </v-list>
        </div>

        <v-alert v-if="diveDataStore.error" type="error" class="mt-4" variant="tonal">
          {{ diveDataStore.error }}
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
</style>
