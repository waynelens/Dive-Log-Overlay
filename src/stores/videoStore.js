import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useVideoStore = defineStore('video', () => {
  // State
  const videoFile = ref(null)
  const videoUrl = ref(null)
  const videoDuration = ref(0)
  const currentTime = ref(0)
  const isPlaying = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  // Computed
  const hasVideo = computed(() => videoFile.value !== null)
  const videoFileName = computed(() => videoFile.value?.name || '')

  // Actions
  function setVideoFile(file) {
    videoFile.value = file
    if (file) {
      // Create object URL for video preview
      if (videoUrl.value) {
        URL.revokeObjectURL(videoUrl.value)
      }
      videoUrl.value = URL.createObjectURL(file)
    }
    error.value = null
  }

  function setVideoDuration(duration) {
    videoDuration.value = duration
  }

  function setCurrentTime(time) {
    currentTime.value = time
  }

  function setPlaying(playing) {
    isPlaying.value = playing
  }

  function setLoading(loading) {
    isLoading.value = loading
  }

  function setError(err) {
    error.value = err
    isLoading.value = false
  }

  function reset() {
    if (videoUrl.value) {
      URL.revokeObjectURL(videoUrl.value)
    }
    videoFile.value = null
    videoUrl.value = null
    videoDuration.value = 0
    currentTime.value = 0
    isPlaying.value = false
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    videoFile,
    videoUrl,
    videoDuration,
    currentTime,
    isPlaying,
    isLoading,
    error,
    // Computed
    hasVideo,
    videoFileName,
    // Actions
    setVideoFile,
    setVideoDuration,
    setCurrentTime,
    setPlaying,
    setLoading,
    setError,
    reset,
  }
})
