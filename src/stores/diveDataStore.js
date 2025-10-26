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
  const minTemperature = computed(() => parsedData.value?.minTemperature || 0)
  const diveNumber = computed(() => parsedData.value?.diveNumber || 0)
  const date = computed(() => parsedData.value?.date || '')
  const maxDescentRate = computed(() => {
    const waypoints = parsedData.value?.waypoints || []
    if (waypoints.length === 0) return 0
    return Math.max(...waypoints.map(w => w.descentRate || 0))
  })
  const maxAscentRate = computed(() => {
    const waypoints = parsedData.value?.waypoints || []
    if (waypoints.length === 0) return 0
    return Math.max(...waypoints.map(w => w.ascentRate || 0))
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
    minTemperature,
    diveNumber,
    date,
    maxDescentRate,
    maxAscentRate,
    // Actions
    setRawData,
    setParsedData,
    setLoading,
    setError,
    reset,
  }
})
