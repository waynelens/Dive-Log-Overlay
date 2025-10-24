<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  diveData: {
    type: Object,
    required: true,
  },
  currentTime: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['timeSelected'])

const selectedMetric = ref('depth')
const showDepth = ref(true)
const showTemperature = ref(true)

const chartData = computed(() => {
  if (!props.diveData || !props.diveData.waypoints) {
    return null
  }

  const waypoints = props.diveData.waypoints
  const labels = waypoints.map((w) => w.divetime)

  const datasets = []

  if (showDepth.value) {
    datasets.push({
      label: '深度 (m)',
      data: waypoints.map((w) => w.depth),
      borderColor: '#1976D2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y',
    })
  }

  if (showTemperature.value) {
    datasets.push({
      label: '溫度 (°C)',
      data: waypoints.map((w) => w.temperature),
      borderColor: '#FF5252',
      backgroundColor: 'rgba(255, 82, 82, 0.1)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y1',
    })
  }

  return {
    labels,
    datasets,
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    title: {
      display: true,
      text: '潛水數據圖表',
    },
    tooltip: {
      callbacks: {
        title: (context) => {
          const seconds = context[0].label
          const minutes = Math.floor(seconds / 60)
          const secs = Math.floor(seconds % 60)
          return `時間: ${minutes}:${secs.toString().padStart(2, '0')}`
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: '潛水時間 (秒)',
      },
    },
    y: {
      type: 'linear',
      display: showDepth.value,
      position: 'left',
      title: {
        display: true,
        text: '深度 (m)',
      },
      reverse: true, // Depth increases downward
    },
    y1: {
      type: 'linear',
      display: showTemperature.value,
      position: 'right',
      title: {
        display: true,
        text: '溫度 (°C)',
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
  onClick: (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index
      const waypoint = props.diveData.waypoints[index]
      emit('timeSelected', waypoint.divetime)
    }
  },
}))
</script>

<template>
  <v-card>
    <v-card-title>
      <v-icon icon="mdi-chart-line" class="mr-2" />
      數據可視化
    </v-card-title>

    <v-card-text>
      <v-row class="mb-4">
        <v-col cols="12">
          <v-chip-group>
            <v-chip
              :color="showDepth ? 'primary' : 'default'"
              @click="showDepth = !showDepth"
            >
              <v-icon icon="mdi-arrow-down" class="mr-1" />
              深度
            </v-chip>
            <v-chip
              :color="showTemperature ? 'error' : 'default'"
              @click="showTemperature = !showTemperature"
            >
              <v-icon icon="mdi-thermometer" class="mr-1" />
              溫度
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <div class="chart-container">
        <Line v-if="chartData" :data="chartData" :options="chartOptions" />
        <div v-else class="text-center pa-8">
          <v-icon icon="mdi-chart-line-variant" size="64" color="grey" />
          <p class="text-grey mt-4">無數據可顯示</p>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.chart-container {
  height: 400px;
  position: relative;
}
</style>
