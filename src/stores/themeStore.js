import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 從 localStorage 讀取使用者偏好，或使用系統偏好
  const getInitialTheme = () => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'

    // 偵測系統偏好
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const isDark = ref(getInitialTheme())

  // 監聽變化並同步到 localStorage
  watch(
    isDark,
    newVal => {
      const themeName = newVal ? 'dark' : 'light'
      localStorage.setItem('theme', themeName)

      // 更新 HTML data attribute 供 Vuetify 使用
      document.documentElement.setAttribute('data-theme', themeName)
    },
    { immediate: true }
  )

  // 監聽系統主題變化（當使用者沒有手動設定時）
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
  prefersDark.addEventListener('change', e => {
    // 只有在沒有手動設定過主題時，才跟隨系統
    if (!localStorage.getItem('theme')) {
      isDark.value = e.matches
    }
  })

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  function setTheme(theme) {
    isDark.value = theme === 'dark'
  }

  return {
    isDark,
    toggleTheme,
    setTheme,
  }
})
