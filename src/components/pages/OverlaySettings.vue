<template>
    <v-card>
        <v-card-title>
            <v-icon start>mdi-cog</v-icon>
            {{ $t('overlay.settings.title') }}
        </v-card-title>

        <v-card-text>
            <!-- 預覽模式開關 -->
            <v-switch v-model="overlayStore.previewMode" :label="$t('overlay.settings.previewMode')" color="primary"
                hide-details class="mb-4" />

            <v-divider class="my-4" />

            <!-- 欄位選擇 -->
            <div class="mb-4">
                <div class="text-subtitle-2 mb-2">{{ $t('overlay.settings.fields') }}</div>
                <v-checkbox v-for="field in overlayStore.availableFields" :key="field.key" v-model="field.enabled"
                    :label="$t(field.label)" color="primary" hide-details density="compact" />
            </div>

            <v-divider class="my-4" />

            <!-- 樣式設定 -->
            <div class="mb-4">
                <div class="text-subtitle-2 mb-2">{{ $t('overlay.settings.style') }}</div>

                <!-- 位置選擇 -->
                <v-select v-model="overlayStore.overlayStyle.position" :label="$t('overlay.settings.position')"
                    :items="positionOptions" item-title="text" item-value="value" variant="outlined" density="compact"
                    class="mb-3" />

                <!-- 不透明度 -->
                <div class="mb-3">
                    <div class="text-caption mb-1">
                        {{ $t('overlay.settings.opacity') }}: {{ (overlayStore.overlayStyle.opacity * 100).toFixed(0)
                        }}%
                    </div>
                    <v-slider v-model="overlayStore.overlayStyle.opacity" :min="0" :max="1" :step="0.05" thumb-label
                        color="primary" hide-details>
                        <template #thumb-label="{ modelValue }">
                            {{ (modelValue * 100).toFixed(0) }}%
                        </template>
                    </v-slider>
                </div>

                <!-- 字體大小 -->
                <div class="mb-3">
                    <div class="text-caption mb-1">
                        {{ $t('overlay.settings.fontSize') }}: {{ overlayStore.overlayStyle.fontSize }}px
                    </div>
                    <v-slider v-model="overlayStore.overlayStyle.fontSize" :min="12" :max="32" :step="1" thumb-label
                        color="primary" hide-details />
                </div>
            </div>

            <v-divider class="my-4" />

            <!-- 重置按鈕 -->
            <v-btn block variant="outlined" color="error" prepend-icon="mdi-restore" @click="overlayStore.reset">
                {{ $t('overlay.settings.reset') }}
            </v-btn>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOverlayStore } from '@/stores/overlayStore'

const { t } = useI18n()
const overlayStore = useOverlayStore()

const positionOptions = computed(() => [
    { text: t('overlay.position.top'), value: 'top' },
    { text: t('overlay.position.bottom'), value: 'bottom' },
    { text: t('overlay.position.topLeft'), value: 'top-left' },
    { text: t('overlay.position.topRight'), value: 'top-right' },
    { text: t('overlay.position.bottomLeft'), value: 'bottom-left' },
    { text: t('overlay.position.bottomRight'), value: 'bottom-right' },
])
</script>

<style scoped>
/* 樣式可以根據需要調整 */
</style>
