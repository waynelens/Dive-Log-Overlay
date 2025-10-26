import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDiveDataStore = defineStore('diveData', () => {
  // State
  const rawData = ref(null)
  const parsedData = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Computed
  const hasDiveData = computed(() => parsedData.value !== null)
  const waypoints = computed(() => parsedData.value?.waypoints || [])
  const diveDuration = computed(() => parsedData.value?.diveDuration || 0)
  const maxDepth = computed(() => parsedData.value?.maxDepth || 0)
  const avgTemperature = computed(() => {
    const waypoints = parsedData.value?.waypoints || []
    if (waypoints.length === 0) return 0
    const sum = waypoints.reduce((acc, w) => acc + (w.temperature || 0), 0)
    return sum / waypoints.length
  })
  const diveNumber = computed(() => parsedData.value?.diveNumber || 0)
  const date = computed(() => parsedData.value?.date || '')
  const avgDescentRate = computed(() => {
    const waypoints = parsedData.value?.waypoints || []
    if (waypoints.length === 0) return 0

    let totalDescentDepth = 0
    let totalDescentTime = 0

    for (let i = 1; i < waypoints.length; i++) {
      const depthDiff = waypoints[i].depth - waypoints[i - 1].depth
      const timeDiff = waypoints[i].divetime - waypoints[i - 1].divetime

      // Only count descent (positive depth change)
      if (depthDiff > 0) {
        totalDescentDepth += depthDiff
        totalDescentTime += timeDiff
      }
    }

    if (totalDescentTime === 0) return 0
    // Calculate m/s (no conversion needed)
    return totalDescentDepth / totalDescentTime
  })
  const avgAscentRate = computed(() => {
    const waypoints = parsedData.value?.waypoints || []
    if (waypoints.length === 0) return 0

    let totalAscentDepth = 0
    let totalAscentTime = 0

    for (let i = 1; i < waypoints.length; i++) {
      const depthDiff = waypoints[i].depth - waypoints[i - 1].depth
      const timeDiff = waypoints[i].divetime - waypoints[i - 1].divetime

      // Only count ascent (negative depth change)
      if (depthDiff < 0) {
        totalAscentDepth += Math.abs(depthDiff)
        totalAscentTime += timeDiff
      }
    }

    if (totalAscentTime === 0) return 0
    // Calculate m/s (no conversion needed)
    return totalAscentDepth / totalAscentTime
  })

  // Actions
  function setRawData(data) {
    rawData.value = data
  }

  function setParsedData(data) {
    parsedData.value = data
    error.value = null
  }

  function setLoading(loading) {
    isLoading.value = loading
  }

  function setError(err) {
    error.value = err
    isLoading.value = false
  }

  function reset() {
    rawData.value = null
    parsedData.value = null
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    rawData,
    parsedData,
    isLoading,
    error,
    // Computed
    hasDiveData,
    waypoints,
    diveDuration,
    maxDepth,
    avgTemperature,
    diveNumber,
    date,
    avgDescentRate,
    avgAscentRate,
    // Actions
    setRawData,
    setParsedData,
    setLoading,
    setError,
    reset,
  }
})
