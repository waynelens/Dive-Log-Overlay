import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSyncStore = defineStore('sync', () => {
  // State
  const timeOffset = ref(0) // Offset between video start and dive log start (in seconds)
  const isSynced = ref(false)

  // Computed
  const offsetSeconds = computed(() => timeOffset.value)

  // Actions
  function setTimeOffset(offset) {
    timeOffset.value = offset
    isSynced.value = true
  }

  function resetSync() {
    timeOffset.value = 0
    isSynced.value = false
  }

  /**
   * Get dive data index for a given video time
   * @param {number} videoTime - Current video time in seconds
   * @returns {number} - Corresponding dive data index
   */
  function getDiveTimeForVideoTime(videoTime) {
    return Math.max(0, videoTime - timeOffset.value)
  }

  /**
   * Get video time for a given dive time
   * @param {number} diveTime - Dive time in seconds
   * @returns {number} - Corresponding video time
   */
  function getVideoTimeForDiveTime(diveTime) {
    return diveTime + timeOffset.value
  }

  return {
    // State
    timeOffset,
    isSynced,
    // Computed
    offsetSeconds,
    // Actions
    setTimeOffset,
    resetSync,
    getDiveTimeForVideoTime,
    getVideoTimeForDiveTime,
  }
})
