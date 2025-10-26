# dive-log-overlay-tool

## 專案簡介

本專案是一個使用 **Vue 3 + Vuetify** 所開發的 **單頁式（SPA）純前端網站**，

提供潛水手錶數據與潛水影片的上傳、時間軸對齊與疊加輸出功能。

使用者可以上傳 Atmos App 匯出的潛水記錄檔（UDDF 格式），並將其生成動態 overlay 動畫，

最後與影片進行合成，輸出帶有潛水資訊的最終影片。

## ⚙️ 系統功能規格

### 一、檔案上傳與格式支援

- **潛水記錄上傳**
    - 支援格式：`UDDF`（Atmos App 匯出標準格式）
    - 每筆潛水包含 `waypoints`、`divetime`、`depth`、`temperature` 等資料。
- **影片上傳**
    - 支援常見影片格式（MP4、MOV、AVI、MKV 等）
    - 透過拖曳或選取檔案上傳。

### 二、數據解析（UDDF Parser）

- 解析內容：
    - **基本資訊**：
        - `date`：潛水日期（ISO 8601 格式）
        - `diveNumber`：潛水次數（第幾次下潛）
    - **時間序列資料**：
        - `waypoints`：每個採樣時間點資料
        - `divetime`：潛水總時長（秒）
    - **深度資料**：
        - `depth`：深度（單位：公尺）
        - `descentRate`：下潛速度（單位：公尺/分鐘）
        - `ascentRate`：上浮速度（單位：公尺/分鐘）
    - **環境資料**：
        - `temperature`：溫度（單位：攝氏度，UDDF 原始為 Kelvin 需轉換）
- 解析後以結構化 JSON 儲存，供後續繪圖與動畫使用。

### 三、數據可視化（Dive Data Visualization）

- 使用 **Chart.js** 或 **ECharts** 呈現曲線圖。
- X 軸為潛水時間軸（divetime），Y 軸可切換顯示：
    - 深度（Depth）
    - 溫度（Temperature）
    - 下潛速度（Descent Rate）
    - 上浮速度（Ascent Rate）
    - 其他潛水相關指標（可擴充）
- 可切換顯示/隱藏各曲線。
- 支援游標懸停顯示時間點的即時數值。
- 顯示潛水基本資訊（日期、潛水次數）。

### 四、影片預覽與時間軸對齊

- 影片播放器採用原生 `<video>` 元件或 Video.js。
- 使用者可拖拉時間軸（timeline slider）對齊：
    - 影片起始時間 ↔ 潛水紀錄起點。
- 若影片長度超過記錄長度，則記錄停在最後一筆數據。
- 即時預覽同步效果。

### 五、生成 Overlay 動畫 / 影片

- 使用 **HTML5 Canvas** 繪製 overlay 動畫：
    - 每幀顯示：
        - 深度（Depth）
        - 溫度（Temperature）
        - 潛水時間（Dive Time）
        - 潛水日期（Date）
        - 下潛/上浮速度（Descent/Ascent Rate）
    - 樣式：
        - 底部半透明條狀背景。
        - 文字範例：「Depth: 15.2m | Temp: 25°C | Time: 05:45 | Rate: ↓2.5m/min」。
- 畫面更新率：**30 FPS**。
- 使用 **CCapture.js** 擷取 Canvas 幀，輸出 WebM 格式（供後續疊加）。

### 六、疊加與輸出（FFmpeg.wasm）

- 使用 **FFmpeg.wasm** 執行影片合成。
- 濾鏡：`overlay`（支援 alpha 通道）
    - 若 overlay 解析度不同，自動縮放。
- 輸出格式：MP4
- 提供輸出參數設定視窗：
    - 影片解析度
    - 幀率
    - 編碼品質（Bitrate）
- 支援：
    - 影片預覽
    - 輸出並下載結果影片

## 🧱 前端技術架構

| 類別 | 技術 |
| --- | --- |
| **前端框架** | **Vue 3 (Composition API)** |
| **UI 元件庫** | **Vuetify 3** |
| **圖表套件** | **Chart.js 或 ECharts** |
| **動畫生成** | **Canvas + CCapture.js** |
| **影片合成** | **FFmpeg.wasm** |
| **檔案上傳** | **HTML5 Drag & Drop API** |
| **多語言支援** | **vue-i18n (v9)** |
| **架構類型** | **SPA（Single Page Application）** |
| **單元測試** | **Vitest + @vue/test-utils + @testing-library/vue + jsdom** |

## 🌐 多語言支援（i18n）

本專案使用 **vue-i18n (v9)** 實現完整的國際化支援，目前提供以下語言：

- **🇹🇼 繁體中文（zh-TW）**
- **🇺🇸 英文（en-US）**

### 功能特色

1. **語言自動偵測**
   - 首次訪問時根據瀏覽器語言自動選擇（中文環境預設為繁體中文，其他為英文）
   - 使用者可透過右上角語言切換按鈕手動切換

2. **持久化儲存**
   - 使用者選擇的語言偏好會儲存在 `localStorage`
   - 下次訪問時自動載入先前的語言設定

3. **完整翻譯覆蓋**
   - 所有 UI 文字、按鈕、訊息提示均已翻譯
   - 包含錯誤訊息、表單標籤、圖表標題等

### 語言檔案結構

```
src/
└── locales/
    ├── zh-TW.json    # 繁體中文翻譯
    └── en-US.json    # 英文翻譯
```

## 🧩 Component 結構設計

```scss
App.vue (頂層組件)
├── HeaderBar.vue (輔助組件)
├── FooterBar.vue (輔助組件)
├── UploadSection.vue (頁面組件)
│   ├── DiveLogUploader.vue (子組件)
│   │     └─ emits: 'diveDataUploaded' → UploadSection
│   └── VideoUploader.vue (子組件)
│         └─ emits: 'videoUploaded' → UploadSection
│
├── Workspace.vue (頁面組件)
│   ├── Props:
│   │     diveData ← UploadSection
│   │     videoFile ← UploadSection
│   │
│   ├── DiveChart.vue (子組件)
│   │     Props: diveData
│   │     Emits: 'timeSelected' → Workspace
│   │
│   ├── VideoPlayer.vue (子組件)
│   │     Props: videoFile, currentTime
│   │     Emits: 'timeUpdated' → Workspace
│   │
│   └── SyncTimeline.vue (子組件)
│         Props: diveData, videoDuration, currentOffset
│         Emits: 'offsetChanged' → Workspace
│
└── ExportDialog.vue (輔助組件)
      Props: diveData, videoFile, overlayOptions
      Emits: 'exportStarted', 'exportFinished' → App.vue
```

### 🔹 資料流說明

1. **UploadSection → Workspace**
    - 上傳完成後，潛水紀錄 `diveData` 與影片 `videoFile` 傳給 Workspace。
2. **Workspace ↔ 子組件**
    - DiveChart: 顯示曲線圖，可發出 `timeSelected` 事件給 Workspace（用於滑動選點或同步）
    - VideoPlayer: 播放影片，可發出 `timeUpdated` 事件，Workspace 接收後更新 SyncTimeline
    - SyncTimeline: 調整影片與紀錄的 offset，發出 `offsetChanged` 給 Workspace，Workspace 再同步 DiveChart 與 VideoPlayer
3. **ExportDialog**
    - Workspace 或 App 傳入資料與 overlay 設定
    - ExportDialog 執行匯出，完成後透過事件通知 App