<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  videoFile: {
    type: Object,
    required: false,
    default: null,
  },
  videoUrl: {
    type: String,
    required: false,
    default: null,
  },
  currentTime: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['timeUpdated', 'durationLoaded'])

const videoRef = ref(null)
const isPlaying = ref(false)
const duration = ref(0)
const volume = ref(1)

watch(() => props.currentTime, (newTime) => {
  if (videoRef.value && Math.abs(videoRef.value.currentTime - newTime) > 0.5) {
    videoRef.value.currentTime = newTime
  }
})

function handleLoadedMetadata() {
  if (videoRef.value) {
    duration.value = videoRef.value.duration
    emit('durationLoaded', duration.value)
  }
}

function handleTimeUpdate() {
  if (videoRef.value) {
    emit('timeUpdated', videoRef.value.currentTime)
  }
}

function handlePlay() {
  isPlaying.value = true
}

function handlePause() {
  isPlaying.value = false
}

function togglePlay() {
  if (videoRef.value) {
    if (isPlaying.value) {
      videoRef.value.pause()
    } else {
      videoRef.value.play()
    }
  }
}

function seekTo(time) {
  if (videoRef.value) {
    videoRef.value.currentTime = time
  }
}

function handleVolumeChange() {
  if (videoRef.value) {
    videoRef.value.volume = volume.value
  }
}

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.volume = volume.value
  }
})

onBeforeUnmount(() => {
  if (videoRef.value) {
    videoRef.value.pause()
  }
})

defineExpose({
  seekTo,
  togglePlay,
})
</script>

<template>
  <v-card>
    <v-card-title>
      <v-icon icon="mdi-play-circle" class="mr-2" />
      影片播放器
    </v-card-title>

    <v-card-text>
      <div v-if="videoUrl" class="video-container">
        <video
          ref="videoRef"
          :src="videoUrl"
          class="video-player"
          @loadedmetadata="handleLoadedMetadata"
          @timeupdate="handleTimeUpdate"
          @play="handlePlay"
          @pause="handlePause"
        />

        <div class="video-controls mt-4">
          <v-row align="center">
            <v-col cols="auto">
              <v-btn
                :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
                color="primary"
                @click="togglePlay"
              />
            </v-col>
            <v-col>
              <div class="d-flex align-center">
                <v-icon icon="mdi-volume-high" class="mr-2" />
                <v-slider
                  v-model="volume"
                  min="0"
                  max="1"
                  step="0.1"
                  hide-details
                  @update:model-value="handleVolumeChange"
                />
              </div>
            </v-col>
            <v-col cols="auto">
              <span class="text-caption">
                {{ Math.floor(currentTime) }} / {{ Math.floor(duration) }} 秒
              </span>
            </v-col>
          </v-row>
        </div>
      </div>

      <div v-else class="no-video text-center pa-8">
        <v-icon icon="mdi-video-off" size="64" color="grey" />
        <p class="text-grey mt-4">請先上傳影片檔案</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.video-container {
  width: 100%;
}

.video-player {
  width: 100%;
  max-height: 500px;
  background-color: #000;
  border-radius: 8px;
}

.no-video {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.video-controls {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 8px;
}
</style>
