import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExportStore = defineStore('export', () => {
  // State
  const isExporting = ref(false)
  const exportProgress = ref(0)
  const exportError = ref(null)
  const exportConfig = ref({
    resolution: '1920x1080',
    frameRate: 30,
    bitrate: '5000k',
    overlayPosition: 'bottom',
    overlayOpacity: 0.8,
  })

  // Computed
  const canExport = computed(() => !isExporting.value)
  const progressPercentage = computed(() => Math.round(exportProgress.value * 100))

  // Actions
  function setExporting(exporting) {
    isExporting.value = exporting
    if (exporting) {
      exportProgress.value = 0
      exportError.value = null
    }
  }

  function setProgress(progress) {
    exportProgress.value = Math.max(0, Math.min(1, progress))
  }

  function setError(error) {
    exportError.value = error
    isExporting.value = false
  }

  function updateConfig(config) {
    exportConfig.value = { ...exportConfig.value, ...config }
  }

  function resetExport() {
    isExporting.value = false
    exportProgress.value = 0
    exportError.value = null
  }

  return {
    // State
    isExporting,
    exportProgress,
    exportError,
    exportConfig,
    // Computed
    canExport,
    progressPercentage,
    // Actions
    setExporting,
    setProgress,
    setError,
    updateConfig,
    resetExport,
  }
})
