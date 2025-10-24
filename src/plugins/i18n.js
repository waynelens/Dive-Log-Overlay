import { createI18n } from 'vue-i18n'
import zhTW from '@/locales/zh-TW.json'
import enUS from '@/locales/en-US.json'

// Get browser language or default to zh-TW
function getDefaultLocale() {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) {
    return savedLocale
  }
  
  const browserLang = navigator.language || navigator.userLanguage
  if (browserLang.startsWith('zh')) {
    return 'zh-TW'
  }
  return 'en-US'
}

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getDefaultLocale(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-TW': zhTW,
    'en-US': enUS,
  },
  // Enable global injection
  globalInjection: true,
})

export default i18n

// Export helper function to change locale
export function setLocale(locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
}

export function getCurrentLocale() {
  return i18n.global.locale.value
}
