import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOverlayStore = defineStore('overlay', () => {
  // 可選擇顯示的數據欄位
  const availableFields = ref([
    { key: 'date', label: 'overlay.fields.date', enabled: true },
    { key: 'diveNumber', label: 'overlay.fields.diveNumber', enabled: true },
    { key: 'depth', label: 'overlay.fields.depth', enabled: true },
    { key: 'temperature', label: 'overlay.fields.temperature', enabled: true },
    { key: 'divetime', label: 'overlay.fields.divetime', enabled: true },
    { key: 'descentRate', label: 'overlay.fields.descentRate', enabled: false },
    { key: 'ascentRate', label: 'overlay.fields.ascentRate', enabled: false },
  ])

  // 疊加層樣式配置
  const overlayStyle = ref({
    position: 'bottom', // 'top', 'bottom', 'top-left', 'top-right', etc.
    opacity: 0.8,
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textColor: '#FFFFFF',
  })

  // 預覽模式開關
  const previewMode = ref(false)

  // 切換欄位啟用狀態
  function toggleField(key) {
    const field = availableFields.value.find(f => f.key === key)
    if (field) {
      field.enabled = !field.enabled
    }
  }

  // 重置為預設值
  function reset() {
    availableFields.value = [
      { key: 'date', label: 'overlay.fields.date', enabled: true },
      { key: 'diveNumber', label: 'overlay.fields.diveNumber', enabled: true },
      { key: 'depth', label: 'overlay.fields.depth', enabled: true },
      { key: 'temperature', label: 'overlay.fields.temperature', enabled: true },
      { key: 'divetime', label: 'overlay.fields.divetime', enabled: true },
      { key: 'descentRate', label: 'overlay.fields.descentRate', enabled: false },
      { key: 'ascentRate', label: 'overlay.fields.ascentRate', enabled: false },
    ]
    overlayStyle.value = {
      position: 'bottom',
      opacity: 0.8,
      fontSize: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      textColor: '#FFFFFF',
    }
    previewMode.value = false
  }

  return {
    availableFields,
    overlayStyle,
    previewMode,
    toggleField,
    reset,
  }
})
