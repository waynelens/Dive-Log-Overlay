<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDiveDataStore } from '@/stores/diveDataStore'
import { useVideoStore } from '@/stores/videoStore'
import { useSyncStore } from '@/stores/syncStore'
import DiveChart from './DiveChart.vue'
import VideoPlayer from './VideoPlayer.vue'
import SyncTimeline from './SyncTimeline.vue'

const { t } = useI18n()
const diveDataStore = useDiveDataStore()
const videoStore = useVideoStore()
const syncStore = useSyncStore()

const currentTime = ref(0)
const videoDuration = ref(0)

const canWork = computed(() => diveDataStore.hasDiveData && videoStore.hasVideo)

function handleTimeSelected(time) {
  currentTime.value = time
}

function handleTimeUpdated(time) {
  currentTime.value = time
}

function handleDurationLoaded(duration) {
  videoDuration.value = duration
  videoStore.setVideoDuration(duration)
}

function handleOffsetChanged(offset) {
  syncStore.setTimeOffset(offset)
}

function handleTimeChanged(time) {
  currentTime.value = time
}
</script>

<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 mb-2">
          <v-icon icon="mdi-view-dashboard" class="mr-2" />
          {{ t('workspace.title') }}
        </h2>
        <p class="text-body-1 text-grey mb-6">
          {{ t('workspace.description') }}
        </p>
      </v-col>
    </v-row>

    <div v-if="!canWork">
      <v-alert type="warning" variant="tonal" prominent>
        <v-icon icon="mdi-alert" class="mr-2" />
        <strong>{{ t('workspace.warning.title') }}</strong>
        <div class="mt-2">
          {{ t('workspace.warning.description') }}
        </div>
      </v-alert>
    </div>

    <div v-else>
      <v-row>
        <v-col cols="12">
          <DiveChart
            :dive-data="diveDataStore.parsedData"
            :current-time="currentTime"
            @time-selected="handleTimeSelected"
          />
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12" md="7">
          <VideoPlayer
            :video-url="videoStore.videoUrl"
            :current-time="currentTime"
            @time-updated="handleTimeUpdated"
            @duration-loaded="handleDurationLoaded"
          />
        </v-col>
        <v-col cols="12" md="5">
          <SyncTimeline
            :dive-data="diveDataStore.parsedData"
            :video-duration="videoDuration"
            :current-offset="syncStore.timeOffset"
            @offset-changed="handleOffsetChanged"
            @time-changed="handleTimeChanged"
          />
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card>
            <v-card-text class="text-center">
              <v-btn
                color="success"
                size="large"
                prepend-icon="mdi-export"
                :disabled="!syncStore.isSynced"
              >
                {{ t('workspace.export.button') }}
              </v-btn>
              <p class="text-caption text-grey mt-2">
                {{ t('workspace.export.hint') }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
</style>
