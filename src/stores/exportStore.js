import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

export const useExportStore = defineStore('export', () => {
  // State
  let ffmpegInstance = null // Use a plain variable to avoid Vue proxy issues
  const isLoaded = ref(false)
  const isProcessing = ref(false)
  const loadingProgress = ref(0)
  const progress = ref(0)
  const currentStep = ref('idle') // 'loading', 'preparing', 'rendering', 'compositing', 'done', 'error'
  const error = ref(null)
  const outputFile = ref(null)
  const downloadUrl = ref(null)

  // Export settings
  const exportSettings = ref({
    quality: 'high', // 'low', 'medium', 'high'
    format: 'mp4',
    resolution: 'original', // 'original', '1920x1080', '1280x720'
    frameRate: 30,
    videoBitrate: '5000k',
    audioBitrate: '128k',
  })

  // Computed
  const canExport = computed(() => !isProcessing.value && isLoaded.value)
  const isReady = computed(() => isLoaded.value && !isProcessing.value)
  const progressPercentage = computed(() => Math.round(progress.value))

  // Actions
  async function loadFFmpeg() {
    if (isLoaded.value || ffmpegInstance) return

    try {
      currentStep.value = 'loading'
      loadingProgress.value = 0
      error.value = null

      ffmpegInstance = new FFmpeg()

      // Set up log callback
      ffmpegInstance.on('log', ({ message }) => {
        console.log('[FFmpeg]', message)
      })

      // Set up progress callback for processing
      ffmpegInstance.on('progress', ({ progress: p, time }) => {
        console.log('[FFmpeg Progress]', p, time)
        if (currentStep.value === 'compositing') {
          progress.value = p * 100
        }
      })

      // Load FFmpeg with local files from the public directory
      loadingProgress.value = 10
      await ffmpegInstance.load({
        coreURL: await toBlobURL('/ffmpeg.wasm/core/dist/esm/ffmpeg-core.js', 'text/javascript'),
        wasmURL: await toBlobURL('/ffmpeg.wasm/core/dist/esm/ffmpeg-core.wasm', 'application/wasm'),
      })

      isLoaded.value = true
      currentStep.value = 'idle'
      loadingProgress.value = 100

      console.log('FFmpeg loaded successfully')
    } catch (err) {
      console.error('Failed to load FFmpeg:', err)
      error.value = `載入 FFmpeg 失敗: ${err.message}`
      currentStep.value = 'error'
      isLoaded.value = false
    }
  }

  async function exportVideo(config) {
    if (!isLoaded.value || !ffmpegInstance) {
      throw new Error('FFmpeg not loaded')
    }

    if (isProcessing.value) {
      throw new Error('Export already in progress')
    }

    try {
      isProcessing.value = true
      progress.value = 0
      error.value = null
      currentStep.value = 'preparing'

      const { videoFile, overlayData, duration, outputFileName } = config

      // Step 1: Write input video to FFmpeg filesystem
      currentStep.value = 'preparing'
      progress.value = 10
      const videoData = await fetchFile(videoFile)
      await ffmpegInstance.writeFile('input.mp4', videoData)

      // Step 2: Generate overlay frames
      currentStep.value = 'rendering'
      progress.value = 30
      await generateOverlayFrames(overlayData, duration)

      // Step 3: Create overlay video from frames
      progress.value = 60
      await createOverlayVideo(duration)

      // Step 4: Composite video and overlay
      currentStep.value = 'compositing'
      progress.value = 80
      const outputVideoName = outputFileName || 'output.mp4'

      // FFmpeg command to overlay
      await ffmpegInstance.exec([
        '-i',
        'input.mp4',
        '-i',
        'overlay.mp4',
        '-filter_complex',
        '[0:v][1:v]overlay=0:0[v]',
        '-map',
        '[v]',
        '-map',
        '0:a?',
        '-c:v',
        'libx264',
        '-preset',
        'fast',
        '-crf',
        '23',
        '-c:a',
        'copy',
        'output.mp4',
      ])

      // Step 5: Read output file
      currentStep.value = 'done'
      progress.value = 100
      const outputData = await ffmpegInstance.readFile('output.mp4')
      const blob = new Blob([outputData.buffer], { type: 'video/mp4' })

      outputFile.value = blob
      downloadUrl.value = URL.createObjectURL(blob)

      console.log('Video export completed successfully')
      return { blob, downloadUrl: downloadUrl.value }
    } catch (err) {
      console.error('Export failed:', err)
      error.value = `匯出失敗: ${err.message}`
      currentStep.value = 'error'
      throw err
    } finally {
      isProcessing.value = false
    }
  }

  async function generateOverlayFrames(overlayData, duration) {
    const frameRate = exportSettings.value.frameRate
    const totalFrames = Math.ceil(duration * frameRate)

    for (let i = 0; i < totalFrames; i++) {
      const timestamp = i / frameRate
      const canvas = createOverlayCanvas(overlayData, timestamp)

      // Convert canvas to PNG and write to FFmpeg
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      const frameData = await fetchFile(blob)
      const frameFileName = `frame_${i.toString().padStart(6, '0')}.png`

      await ffmpegInstance.writeFile(frameFileName, frameData)

      // Update progress (30% - 60%)
      progress.value = 30 + (i / totalFrames) * 30
    }
  }

  async function createOverlayVideo(duration) {
    const frameRate = exportSettings.value.frameRate

    await ffmpegInstance.exec([
      '-framerate',
      frameRate.toString(),
      '-i',
      'frame_%06d.png',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'rgba',
      '-t',
      duration.toString(),
      'overlay.mp4',
    ])
  }

  function createOverlayCanvas(overlayData, timestamp) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = 1920
    canvas.height = 1080

    // Clear with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Find data point for this timestamp
    const dataPoint = findDataPointAtTime(overlayData, timestamp)

    if (dataPoint) {
      renderOverlayContent(ctx, dataPoint, canvas.width, canvas.height)
    }

    return canvas
  }

  function findDataPointAtTime(overlayData, timestamp) {
    return (
      overlayData.find((data, index) => {
        const nextData = overlayData[index + 1]
        if (!nextData) return data.timestamp <= timestamp
        return data.timestamp <= timestamp && nextData.timestamp > timestamp
      }) || overlayData[overlayData.length - 1]
    )
  }

  function renderOverlayContent(ctx, dataPoint, width, height) {
    // Basic overlay rendering - this will be enhanced with actual overlay store data
    const overlayHeight = 120
    const overlayY = height - overlayHeight - 20

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(20, overlayY, width - 40, overlayHeight)

    // Text
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '24px Arial'
    ctx.textBaseline = 'top'

    const fields = [
      `深度: ${dataPoint.depth?.toFixed(1) || '--'}m`,
      `溫度: ${dataPoint.temperature?.toFixed(1) || '--'}°C`,
      `時間: ${formatDiveTime(dataPoint.divetime || 0)}`,
      `日期: ${dataPoint.date || '--'}`,
    ]

    fields.forEach((field, index) => {
      ctx.fillText(field, 40, overlayY + 20 + index * 30)
    })
  }

  function formatDiveTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function reset() {
    isProcessing.value = false
    progress.value = 0
    currentStep.value = 'idle'
    error.value = null
    outputFile.value = null
    if (downloadUrl.value) {
      URL.revokeObjectURL(downloadUrl.value)
      downloadUrl.value = null
    }
  }

  function cleanup() {
    reset()
    if (ffmpegInstance) {
      // Note: FFmpeg.wasm v0.12+ doesn't need explicit termination
      ffmpegInstance = null
    }
    isLoaded.value = false
  }

  return {
    // State
    isLoaded,
    isProcessing,
    loadingProgress,
    progress,
    currentStep,
    error,
    outputFile,
    downloadUrl,
    exportSettings,

    // Computed
    canExport,
    isReady,
    progressPercentage,

    // Actions
    loadFFmpeg,
    exportVideo,
    reset,
    cleanup,
  }
})
