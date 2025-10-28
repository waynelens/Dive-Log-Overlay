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
    - `descentRate`：下潛速度（單位：公尺/秒）
    - `ascentRate`：上浮速度（單位：公尺/秒）
  - **環境資料**：
    - `temperature`：溫度（單位：攝氏度，UDDF 原始為 Kelvin 需轉換）
- 解析後以結構化 JSON 儲存，供後續繪圖與動畫使用。

### 三、數據可視化（Dive Data Visualization）

- 使用 **Chart.js + vue-chartjs** 呈現曲線圖。
- X 軸為潛水時間軸（divetime），Y 軸可切換顯示：
  - 深度（Depth）
  - 溫度（Temperature）
  - 下潛速度（Descent Rate）
  - 上浮速度（Ascent Rate）
  - 其他潛水相關指標（可擴充）
- 可切換顯示/隱藏各曲線。
- 支援游標懸停顯示時間點的即時數值。
- 支援點擊圖表跳轉到對應影片時間。
- 顯示潛水基本資訊（日期、潛水次數）。

### 四、影片預覽與時間軸對齊

- 影片播放器採用原生 `<video>` 元件。
- 使用者可拖拉時間軸（timeline slider）對齊：
  - 影片起始時間 ↔ 潛水紀錄起點。
- 若影片長度超過記錄長度，則記錄停在最後一筆數據。
- 即時預覽同步效果。
- 支援不調整時間軸直接匯出（offset = 0）。

### 五、覆蓋層設定與預覽

- **可自訂顯示欄位**：
  - 日期、潛水次數、深度、溫度、潛水時間、下潛/上浮速度
- **樣式設定**：
  - 位置：頂部、底部、四個角落
  - 不透明度：0-100%
  - 字體大小：12-32px
  - 背景顏色與文字顏色
- **即時預覽**：
  - 在影片播放器上即時顯示覆蓋層效果
  - 預覽模式可隨時開關

### 六、生成 Overlay 動畫與影片匯出

- 使用 **HTML5 Canvas** 繪製 overlay 動畫：
  - 每幀顯示使用者選擇的資料欄位
  - 樣式依據使用者設定
- 畫面更新率：**30 FPS**（可調整）
- 使用 **FFmpeg.wasm** 執行影片合成
- 支援品質與解析度設定
- 提供匯出進度顯示
- 完成後自動下載結果影片

## 🧱 前端技術架構

| 類別           | 技術                               |
| -------------- | ---------------------------------- |
| **前端框架**   | **Vue 3 (Composition API)**        |
| **UI 元件庫**  | **Vuetify 3**                      |
| **圖表套件**   | **Chart.js + vue-chartjs**         |
| **影片合成**   | **FFmpeg.wasm**                    |
| **檔案上傳**   | **HTML5 Drag & Drop API**          |
| **狀態管理**   | **Pinia**                          |
| **路由**       | **Vue Router**                     |
| **多語言支援** | **vue-i18n (v9)**                  |
| **架構類型**   | **SPA（Single Page Application）** |
| **單元測試**   | **Vitest + @vue/test-utils**       |
| **E2E 測試**   | **Playwright**                     |
| **建置工具**   | **Vite**                           |

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

## 🎨 主題系統

- **自動主題偵測**：根據系統偏好自動切換深色/淺色主題
- **手動切換**：支援使用者手動切換主題
- **持久化儲存**：主題設定儲存在 `localStorage`
- **Vuetify 整合**：與 Vuetify 主題系統完美整合

## 📁 專案結構

```
dive-log-overlay-tool/
├── src/
│   ├── components/
│   │   ├── common/           # 通用元件
│   │   │   ├── HeaderBar.vue
│   │   │   └── FooterBar.vue
│   │   └── pages/            # 頁面元件
│   │       ├── UploadSection.vue
│   │       ├── DiveLogUploader.vue
│   │       ├── VideoUploader.vue
│   │       ├── Workspace.vue
│   │       ├── DiveChart.vue
│   │       ├── VideoPlayer.vue
│   │       ├── SyncTimeline.vue
│   │       ├── OverlaySettings.vue
│   │       ├── OverlayPreview.vue
│   │       └── ExportDialog.vue
│   ├── stores/               # Pinia stores
│   │   ├── diveDataStore.js
│   │   ├── videoStore.js
│   │   ├── syncStore.js
│   │   ├── overlayStore.js
│   │   ├── exportStore.js
│   │   └── themeStore.js
│   ├── utils/                # 工具函式
│   │   └── uddfParser.js
│   ├── locales/              # 多語言檔案
│   │   ├── zh-TW.json
│   │   └── en-US.json
│   ├── plugins/              # Vue plugins
│   │   ├── vuetify.js
│   │   └── i18n.js
│   ├── router/               # 路由設定
│   │   └── index.js
│   ├── __tests__/            # 測試檔案
│   │   ├── uddfParser.spec.js
│   │   └── App.spec.js
│   ├── App.vue
│   └── main.js
├── public/                   # 靜態資源
│   ├── atmos.uddf            # 範例 UDDF 檔案
│   └── LongDong.MP4          # 範例影片
├── e2e/                      # E2E 測試
│   └── vue.spec.js
└── package.json
```

## 🔧 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

專案會在 `http://localhost:8080` 啟動

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

### 執行測試

```bash
# 單元測試
npm run test:unit

# E2E 測試
npm run test:e2e
```

### 程式碼檢查與格式化

```bash
# ESLint 檢查與修復
npm run lint

# Prettier 格式化
npm run format
```

## 🔧 開發注意事項

### FFmpeg.wasm 設定

專案使用 FFmpeg.wasm 進行影片合成，需要：

1. **CORS Headers**：開發伺服器已設定必要的 CORS headers

   ```javascript
   // vite.config.js
   server: {
     headers: {
       'Cross-Origin-Embedder-Policy': 'require-corp',
       'Cross-Origin-Opener-Policy': 'same-origin',
     },
   }
   ```

2. **靜態檔案**：FFmpeg.wasm 核心檔案會自動從 CDN 載入

### 單位說明

- **深度**：公尺 (m)
- **溫度**：攝氏度 (°C) - UDDF 原始格式為 Kelvin，會自動轉換
- **速度**：公尺/秒 (m/s)
- **時間**：秒 (s) 或 MM:SS 格式
- **日期**：ISO 8601 (YYYY-MM-DD)

## 🧩 Component 結構與資料流

```
App.vue
├── HeaderBar.vue
├── FooterBar.vue
├── UploadSection.vue
│   ├── DiveLogUploader.vue → diveDataStore
│   └── VideoUploader.vue → videoStore
└── Workspace.vue
    ├── DiveChart.vue ← diveDataStore
    ├── OverlayPreview (包覆 VideoPlayer)
    │   └── VideoPlayer.vue ← videoStore, syncStore
    ├── SyncTimeline.vue ↔ syncStore
    ├── OverlaySettings.vue ↔ overlayStore
    └── ExportDialog.vue ← 所有 stores
```

### 資料流說明

1. **檔案上傳**：
   - `DiveLogUploader` → `diveDataStore`
   - `VideoUploader` → `videoStore`

2. **時間軸同步**：
   - `SyncTimeline` ↔ `syncStore`
   - `VideoPlayer` 發出時間更新 → `syncStore.updateCurrentTime()`

3. **覆蓋層預覽**：
   - `OverlayPreview` 監聽 `syncStore.currentVideoTime` 和 `overlayStore.previewMode`
   - 即時計算並顯示對應的潛水數據

4. **影片匯出**：
   - `ExportDialog` 整合所有 stores 的數據
   - 使用 `exportStore` 管理匯出流程

## 📝 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案
