# GitHub Copilot Instructions for Dive Log Overlay Tool

## Project Overview

This is a **Vue 3 + Vuetify** based **SPA (Single Page Application)** that provides dive watch data and video upload, timeline alignment, and overlay export functionality. Users can upload dive log files exported from Atmos App (UDDF format), generate dynamic overlay animations, and composite them with videos to output final videos with dive information.

## Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **UI Component Library**: Vuetify 3
- **Chart Library**: Chart.js or ECharts
- **Animation Generation**: Canvas + CCapture.js
- **Video Composition**: FFmpeg.wasm
- **File Upload**: HTML5 Drag & Drop API
- **State Management**: Pinia
- **Routing**: Vue Router
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
   - Contains: `DiveChart.vue`, `VideoPlayer.vue`, `SyncTimeline.vue`
   - Manages timeline synchronization between video and dive data

3. **ExportDialog.vue** - Export configuration and processing
   - Props: `diveData`, `videoFile`, `overlayOptions`
   - Handles FFmpeg.wasm video composition

### Supporting Components
- **HeaderBar.vue** - Navigation header
- **FooterBar.vue** - Footer information

## Key Features Implementation Guidelines

### 1. UDDF Parser
- Parse XML format UDDF files
- Extract: `waypoints`, `divetime`, `depth`, `temperature`
- Convert to structured JSON format
- Handle parsing errors gracefully
- Location: `src/utils/uddfParser.js`

### 2. Data Visualization
- Use Chart.js or ECharts for line charts
- X-axis: dive time (divetime)
- Y-axis: switchable between depth, temperature, and other metrics
- Support hovering to show real-time values
- Implement show/hide for different data series

### 3. Video Player & Timeline Sync
- Use native `<video>` element or Video.js
- Implement timeline slider for alignment
- Sync video start time with dive log start point
- Handle cases where video length exceeds log length
- Real-time preview of synchronization

### 4. Canvas Overlay Generation
- Use HTML5 Canvas API
- Display: Depth, Temperature, Dive Time per frame
- Style: Semi-transparent bar at bottom
- Update rate: 30 FPS
- Use CCapture.js for frame capture
- Output: WebM format

### 5. Video Composition (FFmpeg.wasm)
- Load FFmpeg.wasm asynchronously
- Use `overlay` filter with alpha channel support
- Support resolution scaling if needed
- Output format: MP4
- Provide progress feedback during processing
- Allow download of final output

## Testing Guidelines

### Unit Tests (Vitest)
- Test UDDF parser with sample files
- Test data transformation utilities
- Test component logic and computed properties
- Mock external dependencies (file uploads, FFmpeg.wasm)
- Location: `src/__tests__/` or `*.spec.js` alongside components

### E2E Tests (Playwright)
- Test file upload flow
- Test video playback and timeline sync
- Test export process (with timeout considerations)
- Location: `e2e/`

## Performance Considerations

- Lazy load heavy libraries (FFmpeg.wasm, CCapture.js)
- Use Web Workers for heavy computations if needed
- Implement proper loading states and progress indicators
- Optimize Canvas rendering (only redraw when necessary)
- Handle large video files with streaming when possible

## Error Handling

- Validate file formats before processing
- Show user-friendly error messages
- Implement try-catch blocks for async operations
- Log errors for debugging (console.error)
- Provide fallback UI states

## State Management (Pinia)

- Create stores for:
  - `diveDataStore`: dive log data and parsing state
  - `videoStore`: video file and playback state
  - `syncStore`: timeline synchronization state
  - `exportStore`: export configuration and progress

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
```

## Special Notes

- All dive data from Atmos App uses UDDF 3.2.3 format
- Depth unit: meters (m)
- Temperature unit: Celsius (°C) - stored as Kelvin in UDDF, needs conversion
- Time format: seconds or MM:SS format
- Sample files available in `public/` directory:
  - `public/atmos.uddf` - Sample dive log
  - `public/LongDong.MP4` - Sample video

## When Generating Code

1. **Always use Composition API** with `<script setup>`
2. **Use Vuetify 3 components** for UI (v-btn, v-card, v-dialog, etc.)
3. **Implement proper TypeScript types** in JSDoc comments if not using TypeScript
4. **Add loading states** for async operations
5. **Include error boundaries** and user feedback
6. **Write unit tests** for utility functions
7. **Follow Vue 3 reactivity** best practices (avoid ref unwrapping issues)
8. **Use Pinia stores** instead of Options API or Vuex
9. **Optimize for performance** - lazy load, code splitting
10. **Make it responsive** - consider mobile/tablet layouts

## File Format References

### UDDF Structure
```xml
<uddf version="3.2.3">
  <profiledata>
    <repetitiongroup>
      <dive>
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
  depth: 15.2,        // meters
  temperature: 25,    // Celsius
  divetime: 345       // seconds
}
```

---

**Last Updated**: October 24, 2025
