<template>
    <div class="overlay-preview-wrapper">
        <slot />

        <transition name="fade">
            <div v-if="overlayStore.previewMode && currentData" class="overlay-preview" :class="positionClass"
                :style="overlayStyleComputed">
                <div class="overlay-content">
                    <div v-for="field in enabledFields" :key="field.key" class="overlay-field">
                        <span class="field-label">{{ $t(field.label) }}:</span>
                        <span class="field-value">{{ formatFieldValue(field.key) }}</span>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOverlayStore } from '@/stores/overlayStore'
import { useDiveDataStore } from '@/stores/diveDataStore'
import { useSyncStore } from '@/stores/syncStore'

const overlayStore = useOverlayStore()
const diveDataStore = useDiveDataStore()
const syncStore = useSyncStore()

// 已啟用的欄位
const enabledFields = computed(() => {
    return overlayStore.availableFields.filter((field) => field.enabled)
})

// 根據目前影片時間取得對應的潛水數據
const currentData = computed(() => {
    if (!diveDataStore.hasDiveData || !syncStore.currentVideoTime) {
        return null
    }

    // 計算潛水數據時間 = 影片時間 - 偏移量
    const diveTime = syncStore.currentVideoTime - syncStore.offset

    if (diveTime < 0) {
        return null
    }

    // 找到最接近的 waypoint
    const waypoints = diveDataStore.waypoints
    const currentWaypoint = waypoints.find((wp, index) => {
        const nextWaypoint = waypoints[index + 1]
        if (!nextWaypoint) {
            return wp.divetime <= diveTime
        }
        return wp.divetime <= diveTime && nextWaypoint.divetime > diveTime
    })

    if (!currentWaypoint) {
        return null
    }

    return {
        date: diveDataStore.date,
        diveNumber: diveDataStore.diveNumber,
        depth: currentWaypoint.depth,
        temperature: currentWaypoint.temperature,
        divetime: currentWaypoint.divetime,
        descentRate: currentWaypoint.descentRate,
        ascentRate: currentWaypoint.ascentRate,
    }
})

// 格式化欄位值
function formatFieldValue(key) {
    if (!currentData.value) return '--'

    const value = currentData.value[key]
    if (value === null || value === undefined) return '--'

    switch (key) {
        case 'date':
            return value
        case 'diveNumber':
            return `#${value}`
        case 'depth':
            return `${value.toFixed(1)}m`
        case 'temperature':
            return `${value.toFixed(1)}°C`
        case 'divetime':
            return formatTime(value)
        case 'descentRate':
        case 'ascentRate':
            return value ? `${value.toFixed(2)}m/s` : '--'
        default:
            return value.toString()
    }
}

// 格式化時間（秒轉 MM:SS）
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 位置 class
const positionClass = computed(() => {
    return `overlay-position-${overlayStore.overlayStyle.position}`
})

// 計算樣式
const overlayStyleComputed = computed(() => {
    const style = overlayStore.overlayStyle
    return {
        opacity: style.opacity,
        fontSize: `${style.fontSize}px`,
        backgroundColor: style.backgroundColor,
        color: style.textColor,
    }
})
</script>

<style scoped>
.overlay-preview-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.overlay-preview {
    position: absolute;
    z-index: 10;
    padding: 12px 16px;
    border-radius: 4px;
    pointer-events: none;
    max-width: 300px;
}

/* 位置樣式 */
.overlay-position-top {
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
}

.overlay-position-bottom {
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
}

.overlay-position-top-left {
    top: 16px;
    left: 16px;
}

.overlay-position-top-right {
    top: 16px;
    right: 16px;
}

.overlay-position-bottom-left {
    bottom: 16px;
    left: 16px;
}

.overlay-position-bottom-right {
    bottom: 16px;
    right: 16px;
}

/* 內容樣式 */
.overlay-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.overlay-field {
    display: flex;
    gap: 8px;
    white-space: nowrap;
}

.field-label {
    font-weight: 600;
}

.field-value {
    font-family: monospace;
}

/* 過渡動畫 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
