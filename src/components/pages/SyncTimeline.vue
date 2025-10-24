<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  diveData: {
    type: Object,
    required: false,
    default: null,
  },
  videoDuration: {
    type: Number,
    default: 0,
  },
  currentOffset: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['offsetChanged', 'timeChanged'])

const timeOffset = ref(props.currentOffset)
const currentTime = ref(0)

const maxTime = computed(() => {
  if (!props.diveData || !props.videoDuration) return 0
  return Math.max(props.diveData.diveDuration, props.videoDuration)
})

const diveEndTime = computed(() => {
  if (!props.diveData) return 0
  return props.diveData.diveDuration
})

watch(timeOffset, (newOffset) => {
  emit('offsetChanged', newOffset)
})

watch(currentTime, (newTime) => {
  emit('timeChanged', newTime)
})

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

function resetSync() {
  timeOffset.value = 0
  currentTime.value = 0
}
</script>

<template>
  <v-card>
    <v-card-title>
      <v-icon icon="mdi-timeline-clock" class="mr-2" />
      {{ t('sync.title') }}
    </v-card-title>

    <v-card-text>
      <div v-if="diveData && videoDuration > 0">
        <v-row class="mb-4">
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">{{ t('sync.offset') }}</div>
            <v-slider
              v-model="timeOffset"
              :min="-videoDuration"
              :max="diveData.diveDuration"
              step="0.1"
              thumb-label
              color="primary"
            >
              <template #append>
                <v-text-field
                  v-model.number="timeOffset"
                  type="number"
                  step="0.1"
                  style="width: 100px"
                  density="compact"
                  hide-details
                  :suffix="t('video.seconds')"
                />
              </template>
            </v-slider>
          </v-col>
        </v-row>

        <v-row class="mb-4">
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">{{ t('sync.currentTime') }}</div>
            <v-slider
              v-model="currentTime"
              :min="0"
              :max="maxTime"
              step="0.1"
              thumb-label
              color="secondary"
            >
              <template #append>
                <span class="text-caption">{{ formatTime(currentTime) }}</span>
              </template>
            </v-slider>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card variant="tonal" class="pa-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <div>
                  <v-icon icon="mdi-information" class="mr-2" />
                  <span class="font-weight-bold">{{ t('sync.info.title') }}</span>
                </div>
                <v-btn
                  variant="outlined"
                  size="small"
                  prepend-icon="mdi-refresh"
                  @click="resetSync"
                >
                  {{ t('sync.info.reset') }}
                </v-btn>
              </div>
              
              <v-divider class="my-3" />
              
              <v-row dense>
                <v-col cols="6">
                  <div class="text-caption text-grey">{{ t('sync.info.videoDuration') }}</div>
                  <div class="text-body-2">{{ formatTime(videoDuration) }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-grey">{{ t('sync.info.diveDuration') }}</div>
                  <div class="text-body-2">{{ formatTime(diveData.diveDuration) }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-grey">{{ t('sync.info.timeOffset') }}</div>
                  <div class="text-body-2">{{ timeOffset.toFixed(1) }} {{ t('video.seconds') }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-grey">{{ t('sync.info.diveEndTime') }}</div>
                  <div class="text-body-2">{{ formatTime(diveEndTime + timeOffset) }}</div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-alert type="info" variant="tonal" class="mt-4">
          <v-icon icon="mdi-lightbulb-on" class="mr-2" />
          {{ t('sync.hint') }}
        </v-alert>
      </div>

      <div v-else class="text-center pa-8">
        <v-icon icon="mdi-timeline-alert" size="64" color="grey" />
        <p class="text-grey mt-4">{{ t('sync.noData') }}</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
</style>
