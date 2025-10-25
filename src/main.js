import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import { useThemeStore } from './stores/themeStore'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(vuetify)

// 初始化主題 store 以同步 Vuetify 主題
const themeStore = useThemeStore()
vuetify.theme.global.name.value = themeStore.isDark ? 'dark' : 'light'

// 監聽主題變化並更新 Vuetify
import { watch } from 'vue'
watch(
  () => themeStore.isDark,
  isDark => {
    vuetify.theme.global.name.value = isDark ? 'dark' : 'light'
  }
)

app.mount('#app')
