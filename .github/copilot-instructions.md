# GitHub Copilot Instructions for Dive Log Overlay Tool

## Project Overview

This is a **Vue 3 + Vuetify** based **SPA (Single Page Application)** that provides dive watch data and video upload, timeline alignment, and overlay export functionality. Users can upload dive log files exported from Atmos App (UDDF format), generate dynamic overlay animations, and composite them with videos to output final videos with dive information.

## Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **UI Component Library**: Vuetify 3
- **Chart Library**: Chart.js + vue-chartjs
- **Video Composition**: FFmpeg.wasm
- **File Upload**: HTML5 Drag & Drop API
- **State Management**: Pinia
- **Routing**: Vue Router
- **Internationalization**: vue-i18n (v9)
- **Testing**: Vitest + @vue/test-utils + Playwright
- **Build Tool**: Vite

## Code Style Guidelines

### Vue 3 Best Practices
- Use **Composition API** with `<script setup>` syntax
- Use `ref` and `reactive` for state management
- Implement proper lifecycle hooks: `onMounted`, `onUnmounted`, `watch`, `computed`
- Use `defineProps` and `defineEmits` for component communication
- Keep components focused and single-responsibility

### File Structure
- Components should be placed in `src/components/`
- Page components: `src/components/pages/`
- Reusable sub-components: `src/components/common/`
- Stores (Pinia): `src/stores/`
- Router configuration: `src/router/`
- Utility functions: `src/utils/`
- Test files: `src/__tests__/` or alongside component files with `.spec.js` extension

### Naming Conventions
- Component files: PascalCase (e.g., `DiveLogUploader.vue`, `VideoPlayer.vue`)
- Composables: camelCase with `use` prefix (e.g., `useDiveData.js`, `useVideoSync.js`)
- Store files: camelCase (e.g., `diveDataStore.js`, `videoStore.js`)
- Utility files: camelCase (e.g., `uddfParser.js`, `canvasRenderer.js`)

## Component Architecture

### Page Components
1. **UploadSection.vue** - Handles file uploads
   - Contains: `DiveLogUploader.vue`, `VideoUploader.vue`
   - Emits: `diveDataUploaded`, `videoUploaded`

2. **Workspace.vue** - Main workspace for data visualization and sync
   - Props: `diveData`, `videoFile`
   - Contains: `DiveChart.vue`, `VideoPlayer.vue`, `SyncTimeline.vue`, `OverlaySettings.vue`, `OverlayPreview.vue`
   - Manages timeline synchronization between video and dive data
   - Integrates overlay preview with video player

3. **ExportDialog.vue** - Export configuration and processing
   - Props: `diveData`, `videoFile`, `overlayOptions`
   - Handles FFmpeg.wasm video composition

### Supporting Components
- **HeaderBar.vue** - Navigation header with theme toggle and language switcher
- **FooterBar.vue** - Footer information
- **OverlayPreview.vue** - Real-time overlay preview wrapper
- **OverlaySettings.vue** - Overlay customization panel

## Key Features Implementation Guidelines

### 1. UDDF Parser
- Parse XML format UDDF files
- Extract:
  - **Basic Information**: `date` (dive date), `diveNumber` (dive count/number)
  - **Time Series Data**: `waypoints`, `divetime`
  - **Depth Data**: `depth`, `descentRate` (m/s), `ascentRate` (m/s)
  - **Environmental Data**: `temperature` (convert from Kelvin to Celsius)
- Convert to structured JSON format
- Handle parsing errors gracefully
- Calculate descent/ascent rates between waypoints (in m/s, not m/min)
- Location: [`src/utils/uddfParser.js`](src/utils/uddfParser.js)

### 2. Data Visualization
- Use Chart.js with vue-chartjs for line charts
- X-axis: dive time (divetime)
- Y-axis: switchable between depth, temperature, descent rate, ascent rate, and other metrics
- Support hovering to show real-time values
- Implement show/hide for different data series
- Display dive basic information (date, dive number) in chart title or info panel
- Support click-to-seek: clicking on chart jumps video to that time
- Location: [`src/components/pages/DiveChart.vue`](src/components/pages/DiveChart.vue)

### 3. Video Player & Timeline Sync
- Use native `<video>` element
- Implement timeline slider for alignment
- Sync video start time with dive log start point using offset
- Handle cases where video length exceeds log length
- Real-time preview of synchronization
- Support for zero offset (no sync adjustment)
- Location: [`src/components/pages/VideoPlayer.vue`](src/components/pages/VideoPlayer.vue), [`src/stores/syncStore.js`](src/stores/syncStore.js)

### 4. Overlay Customization & Preview
- **Overlay Settings Panel** ([`src/components/pages/OverlaySettings.vue`](src/components/pages/OverlaySettings.vue)):
  - Toggle preview mode
  - Select which fields to display (date, dive number, depth, temperature, dive time, descent/ascent rate)
  - Customize position (top, bottom, corners)
  - Adjust opacity (0-100%)
  - Set font size (12-32px)
  - Configure colors (background, text)
- **Real-time Preview** ([`src/components/pages/OverlayPreview.vue`](src/components/pages/OverlayPreview.vue)):
  - Wraps video player
  - Displays overlay based on current video time
  - Syncs with dive data using offset from syncStore
  - Updates in real-time during playback
- Store: [`src/stores/overlayStore.js`](src/stores/overlayStore.js)

### 5. Canvas Overlay Generation
- Use HTML5 Canvas API in export process
- Display fields selected by user with custom styling
- Style: Semi-transparent bar with configurable position
- Update rate: 30 FPS (configurable)
- Implementation in [`src/stores/exportStore.js`](src/stores/exportStore.js)

### 6. Video Composition (FFmpeg.wasm)
- Load FFmpeg.wasm asynchronously from `/public/ffmpeg.wasm/`
- Generate overlay frames using Canvas
- Use `overlay` filter with alpha channel support
- Support resolution scaling if needed
- Output format: MP4
- Provide detailed progress feedback:
  - Loading FFmpeg
  - Preparing files
  - Rendering overlay frames
  - Compositing video
  - Done/Error states
- Allow download of final output
- Implementation: [`src/stores/exportStore.js`](src/stores/exportStore.js), [`src/components/pages/ExportDialog.vue`](src/components/pages/ExportDialog.vue)

## Testing Guidelines

### Unit Tests (Vitest)
- Test UDDF parser with sample files: [`src/__tests__/uddfParser.spec.js`](src/__tests__/uddfParser.spec.js)
- Test data transformation utilities
- Test component logic and computed properties
- Mock external dependencies (file uploads, FFmpeg.wasm)
- Run with: `npm run test:unit`

### E2E Tests (Playwright)
- Test file upload flow
- Test video playback and timeline sync
- Test export process (with timeout considerations)
- Location: `e2e/`
- Run with: `npm run test:e2e`

## Performance Considerations

- Lazy load FFmpeg.wasm (loaded only when export dialog opens)
- Implement proper loading states and progress indicators
- Optimize Canvas rendering (only redraw when necessary)
- Handle large video files with proper memory management
- Use computed properties to avoid unnecessary recalculations

## Error Handling

- Validate file formats before processing
- Show user-friendly error messages (i18n)
- Implement try-catch blocks for async operations
- Log errors for debugging (console.error)
- Provide fallback UI states

## State Management (Pinia Stores)

### Implemented Stores

1. **[`diveDataStore.js`](src/stores/diveDataStore.js)**
   - Manages dive log data
   - State: `rawData`, `parsedData`, `isLoading`, `error`
   - Computed: `waypoints`, `diveDuration`, `maxDepth`, `avgTemperature`, etc.

2. **[`videoStore.js`](src/stores/videoStore.js)**
   - Manages video file and playback state
   - State: `videoFile`, `videoUrl`, `videoDuration`, `currentTime`, `isPlaying`
   - Actions: `setVideoFile`, `setCurrentTime`, etc.

3. **[`syncStore.js`](src/stores/syncStore.js)**
   - Manages timeline synchronization
   - State: `timeOffset`, `isSynced`, `currentVideoTime`
   - Actions: `setTimeOffset`, `updateCurrentTime`, `getDiveTimeForVideoTime`, `getVideoTimeForDiveTime`

4. **[`overlayStore.js`](src/stores/overlayStore.js)**
   - Manages overlay settings and preview
   - State: `availableFields`, `overlayStyle`, `previewMode`
   - Actions: `toggleField`, `reset`

5. **[`exportStore.js`](src/stores/exportStore.js)**
   - Manages FFmpeg loading and video export
   - State: `isLoaded`, `isProcessing`, `progress`, `currentStep`, `error`, `exportSettings`
   - Actions: `loadFFmpeg`, `exportVideo`, `reset`, `cleanup`

6. **[`themeStore.js`](src/stores/themeStore.js)**
   - Manages theme (dark/light mode)
   - Auto-detects system preference
   - Persists to localStorage
   - Syncs with Vuetify theme

## Internationalization (i18n)

- Implementation: [`src/plugins/i18n.js`](src/plugins/i18n.js)
- Supported languages: `zh-TW`, `en-US`
- Language files: [`src/locales/zh-TW.json`](src/locales/zh-TW.json), [`src/locales/en-US.json`](src/locales/en-US.json)
- Features:
  - Auto-detect browser language
  - Manual language switching
  - Persistent storage in localStorage
  - Full coverage of UI text, messages, and labels

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (port 8080)
npm run dev

# Build for production
npm run build

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Lint and fix
npm run lint

# Format code
npm run format
```

## Special Notes

### UDDF Format
- All dive data from Atmos App uses UDDF 3.2.3 format
- Depth unit: meters (m)
- Temperature unit: Celsius (°C) - stored as Kelvin in UDDF, needs conversion
- **Descent/Ascent Rate unit: meters per second (m/s)** - NOT meters per minute
- Time format: seconds or MM:SS format
- Date format: ISO 8601 (YYYY-MM-DD)

### FFmpeg.wasm Setup
- Core files must be in `public/ffmpeg.wasm/` directory
- Vite dev server configured with required CORS headers in [`vite.config.js`](vite.config.js)
- Loading is asynchronous and provides progress feedback

### Sample Files
- Sample dive log: `public/atmos.uddf`
- Sample video: `public/LongDong.MP4`

## When Generating Code

1. **Always use Composition API** with `<script setup>`
2. **Use Vuetify 3 components** for UI (v-btn, v-card, v-dialog, etc.)
3. **Use Pinia stores** for state management - don't create new stores without checking existing ones
4. **Use i18n** for all user-facing text - reference [`src/locales/zh-TW.json`](src/locales/zh-TW.json) and [`src/locales/en-US.json`](src/locales/en-US.json)
5. **Add loading states** for async operations
6. **Include error boundaries** and user feedback
7. **Follow Vue 3 reactivity** best practices (avoid ref unwrapping issues)
8. **Optimize for performance** - lazy load, code splitting
9. **Make it responsive** - consider mobile/tablet layouts
10. **Reference existing components** before creating new ones

## File Format References

### UDDF Structure
```xml
<uddf version="3.2.3">
  <profiledata>
    <repetitiongroup>
      <dive>
        <informationbeforedive>
          <divenumber>1</divenumber>
          <datetime>2025-10-24T10:00:00+08:00</datetime>
        </informationbeforedive>
        <samples>
          <waypoint>
            <divetime>1</divetime>
            <depth>0</depth>
            <temperature>300.85</temperature> <!-- Kelvin -->
          </waypoint>
        </samples>
      </dive>
    </repetitiongroup>
  </profiledata>
</uddf>
```

### Overlay Data Format (JSON)
```javascript
{
  timestamp: 35.5,     // video time (seconds) = divetime + offset
  date: '2024-10-20',  // ISO 8601 date
  diveNumber: 42,      // dive count
  depth: 15.2,         // meters
  temperature: 25,     // Celsius
  divetime: 345,       // seconds since dive start
  descentRate: 0.14,   // m/s (positive = descending)
  ascentRate: 0.09     // m/s (positive = ascending)
}
```

---

**Last Updated**: 2025-01-24
