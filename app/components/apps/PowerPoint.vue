<template>
  <div class="powerpoint">
    <!-- Ribbon -->
    <div class="ribbon">
      <div class="ribbon-tabs">
        <button class="tab-btn">Fichier</button>
        <button class="tab-btn active">Accueil</button>
        <button class="tab-btn">Insertion</button>
        <button class="tab-btn">Conception</button>
        <button class="tab-btn">Transitions</button>
        <button class="tab-btn">Animations</button>
        <button class="tab-btn" @click="startPresentation">Diaporama</button>
      </div>
      <div class="ribbon-content">
        <div class="ribbon-group">
          <button class="ribbon-action" @click="startPresentation">
            <Icon name="fluent:play-24-regular" />
            <span>À partir du début</span>
          </button>
          <button class="ribbon-action" :disabled="currentPage <= 1" @click="prevPage">
            <Icon name="fluent:arrow-left-24-regular" />
            <span>Précédente</span>
          </button>
          <button class="ribbon-action" :disabled="currentPage >= pageCount" @click="nextPage">
            <Icon name="fluent:arrow-right-24-regular" />
            <span>Suivante</span>
          </button>
        </div>
        <div class="ribbon-group">
          <button class="ribbon-action" @click="zoomOut">
            <Icon name="fluent:zoom-out-24-regular" />
            <span>Zoom −</span>
          </button>
          <button class="ribbon-action" @click="zoomIn">
            <Icon name="fluent:zoom-in-24-regular" />
            <span>Zoom +</span>
          </button>
          <button class="ribbon-action" @click="resetZoom">
            <Icon name="fluent:full-screen-maximize-24-regular" />
            <span>Ajuster</span>
          </button>
        </div>
        <div class="ribbon-group">
          <button class="ribbon-action" @click="downloadPdf">
            <Icon name="fluent:save-24-regular" />
            <span>Enregistrer</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Workspace -->
    <div class="workspace">
      <!-- Slides panel -->
      <aside class="slides-nav">
        <div class="slides-label">Diapositives</div>
        <template v-if="loading">
          <div v-for="n in 5" :key="n" class="slide-thumb-skeleton"></div>
        </template>
        <div
          v-for="n in pageCount"
          v-else
          :key="n"
          :class="['slide-thumb', { active: currentPage === n }]"
          @click="goToPage(n)"
        >
          <span class="slide-num">{{ n }}</span>
          <div class="thumb-wrap">
            <canvas :ref="el => setThumbRef(el as HTMLCanvasElement | null, n)" class="thumb-canvas"></canvas>
          </div>
        </div>
      </aside>

      <!-- Main canvas -->
      <main class="slide-editor" ref="editorRef">
        <div v-if="loading" class="loading-state">
          <Icon name="fluent:document-pdf-24-regular" class="loading-icon" />
          <span>Chargement…</span>
        </div>
        <div v-else class="canvas-wrapper" :style="{ transform: `scale(${zoom})`, transformOrigin: 'top center' }">
          <canvas ref="mainCanvasRef" class="main-canvas"></canvas>
        </div>
      </main>
    </div>

    <!-- Status Bar -->
    <footer class="status-bar">
      <span>Diapositive {{ currentPage }} sur {{ pageCount }}</span>
      <div class="zoom-controls">
        <button class="zoom-btn" @click="zoomOut"><Icon name="fluent:subtract-24-regular" /></button>
        <div class="zoom-track">
          <div class="zoom-fill" :style="{ width: zoomPercent + '%' }"></div>
        </div>
        <button class="zoom-btn" @click="zoomIn"><Icon name="fluent:add-24-regular" /></button>
        <span class="zoom-label">{{ Math.round(zoom * 100) }}%</span>
      </div>
    </footer>

    <!-- Fullscreen Presentation Overlay -->
    <Transition name="fade">
      <div
        v-if="isPresentation"
        class="presentation-overlay"
        @click="nextPagePres"
        @contextmenu.prevent="prevPage"
      >
        <canvas ref="presCanvasRef" class="pres-canvas"></canvas>
        <div class="pres-hint">
          Clic pour suivant · Clic-droit pour précédent · Échap pour quitter
          <span class="pres-page">{{ currentPage }} / {{ pageCount }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import type * as PDFJSType from 'pdfjs-dist'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'

const currentPage = ref(1)
const pageCount = ref(0)
const isPresentation = ref(false)
const zoom = ref(1)
const loading = ref(true)

const mainCanvasRef = ref<HTMLCanvasElement | null>(null)
const presCanvasRef = ref<HTMLCanvasElement | null>(null)
const editorRef = ref<HTMLElement | null>(null)

const thumbRefs = new Map<number, HTMLCanvasElement>()
function setThumbRef(el: HTMLCanvasElement | null, n: number) {
  if (el) thumbRefs.set(n, el)
}

let pdfDoc: PDFDocumentProxy | null = null
let pdfjsLib: typeof PDFJSType | null = null

const zoomPercent = computed(() => ((zoom.value - 0.5) / 1.5) * 100)

async function initPdf() {
  if (!import.meta.client) return
  const lib = await import('pdfjs-dist')
  const workerUrl = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href
  lib.GlobalWorkerOptions.workerSrc = workerUrl
  pdfjsLib = lib

  const loadingTask = lib.getDocument('/workshop.pdf')
  pdfDoc = await loadingTask.promise
  pageCount.value = pdfDoc.numPages
  loading.value = false

  await nextTick()
  await renderMainPage(currentPage.value)
  renderAllThumbs()
}

async function renderMainPage(pageNum: number) {
  if (!pdfDoc || !mainCanvasRef.value) return
  const page: PDFPageProxy = await pdfDoc.getPage(pageNum)
  const viewport = page.getViewport({ scale: 1.5 })
  const canvas = mainCanvasRef.value
  canvas.width = viewport.width
  canvas.height = viewport.height
  const ctx = canvas.getContext('2d')!
  await page.render({ canvasContext: ctx, viewport }).promise
}

async function renderPresPage(pageNum: number) {
  if (!pdfDoc || !presCanvasRef.value) return
  await nextTick()
  const page: PDFPageProxy = await pdfDoc.getPage(pageNum)
  const screenW = window.innerWidth
  const screenH = window.innerHeight
  const baseVp = page.getViewport({ scale: 1 })
  const scale = Math.min(screenW / baseVp.width, screenH / baseVp.height)
  const viewport = page.getViewport({ scale })
  const canvas = presCanvasRef.value
  canvas.width = viewport.width
  canvas.height = viewport.height
  const ctx = canvas.getContext('2d')!
  await page.render({ canvasContext: ctx, viewport }).promise
}

async function renderThumb(pageNum: number) {
  if (!pdfDoc) return
  const canvas = thumbRefs.get(pageNum)
  if (!canvas) return
  const page: PDFPageProxy = await pdfDoc.getPage(pageNum)
  const viewport = page.getViewport({ scale: 0.18 })
  canvas.width = viewport.width
  canvas.height = viewport.height
  const ctx = canvas.getContext('2d')!
  await page.render({ canvasContext: ctx, viewport }).promise
}

function renderAllThumbs() {
  for (let i = 1; i <= pageCount.value; i++) {
    renderThumb(i)
  }
}

watch(currentPage, async (n) => {
  await renderMainPage(n)
  if (isPresentation.value) await renderPresPage(n)
})

watch(isPresentation, async (active) => {
  if (active) {
    await nextTick()
    await renderPresPage(currentPage.value)
  }
})

function goToPage(n: number) {
  currentPage.value = Math.max(1, Math.min(n, pageCount.value))
}

function nextPage() { goToPage(currentPage.value + 1) }
function prevPage() { goToPage(currentPage.value - 1) }

function nextPagePres() {
  if (currentPage.value < pageCount.value) {
    nextPage()
  } else {
    isPresentation.value = false
  }
}

function startPresentation() {
  currentPage.value = 1
  isPresentation.value = true
}

function zoomIn() { zoom.value = Math.min(2, parseFloat((zoom.value + 0.1).toFixed(1))) }
function zoomOut() { zoom.value = Math.max(0.4, parseFloat((zoom.value - 0.1).toFixed(1))) }
function resetZoom() { zoom.value = 1 }

function downloadPdf() {
  const a = document.createElement('a')
  a.href = '/workshop.pdf'
  a.download = 'workshop.pdf'
  a.click()
}

function onKeydown(e: KeyboardEvent) {
  if (isPresentation.value) {
    if (e.key === 'Escape') isPresentation.value = false
    if (e.key === 'ArrowRight' || e.key === ' ') nextPagePres()
    if (e.key === 'ArrowLeft') prevPage()
  }
}

onMounted(() => {
  initPdf()
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  pdfDoc?.destroy()
})
</script>

<style scoped>
.powerpoint {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f0f0f0;
  color: #333;
  font-family: 'Segoe UI', sans-serif;
  user-select: none;
}

/* Ribbon */
.ribbon {
  background: #fff;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
}

.ribbon-tabs {
  display: flex;
  background: #d24726;
  padding-left: 10px;
}

.tab-btn {
  padding: 8px 16px;
  color: white;
  font-size: 13px;
  transition: background 0.1s;

  &:hover { background: rgba(255,255,255,0.12); }
  &.active { background: #fff; color: #d24726; }
}

.ribbon-content {
  display: flex;
  padding: 8px 10px;
  gap: 4px;
}

.ribbon-group {
  display: flex;
  gap: 4px;
  border-right: 1px solid #eee;
  padding-right: 10px;
  margin-right: 6px;
}

.ribbon-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  width: 58px;
  padding: 4px 2px;
  border-radius: 3px;
  color: #444;
  transition: background 0.1s;

  &:hover:not(:disabled) { background: #f3f3f3; }
  &:disabled { opacity: 0.35; cursor: default; }

  .icon { font-size: 20px; color: #d24726; }
}

/* Workspace */
.workspace {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Sidebar */
.slides-nav {
  width: 150px;
  background: #fff;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.slides-label {
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 4px 6px;
  border-bottom: 1px solid #eee;
  margin-bottom: 2px;
}

.slide-thumb {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  cursor: pointer;
  border-radius: 3px;
  padding: 3px;
  transition: background 0.1s;

  &:hover { background: #f5f5f5; }

  &.active .thumb-wrap {
    outline: 2px solid #d24726;
  }
}

.slide-thumb-skeleton {
  height: 68px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 3px;
  margin: 2px 0;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.slide-num {
  font-size: 10px;
  color: #999;
  width: 14px;
  text-align: right;
  padding-top: 4px;
  flex-shrink: 0;
}

.thumb-wrap {
  flex: 1;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  overflow: hidden;
  border-radius: 1px;
}

.thumb-canvas {
  display: block;
  width: 100%;
  height: auto;
}

/* Main editor */
.slide-editor {
  flex: 1;
  background: #e0e0e0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 80px;
  color: #888;
  font-size: 14px;

  .loading-icon { font-size: 48px; color: #d24726; opacity: 0.5; }
}

.canvas-wrapper {
  transform-origin: top center;
  transition: transform 0.15s;
}

.main-canvas {
  display: block;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  background: white;
}

/* Status Bar */
.status-bar {
  height: 28px;
  background: #fff;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  font-size: 11px;
  color: #666;
  flex-shrink: 0;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-btn {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
  &:hover { color: #333; }
}

.zoom-track {
  width: 80px;
  height: 3px;
  background: #ddd;
  border-radius: 2px;
  overflow: hidden;
}

.zoom-fill {
  height: 100%;
  background: #d24726;
  border-radius: 2px;
  transition: width 0.15s;
}

.zoom-label { min-width: 36px; text-align: right; }

/* Fullscreen presentation */
.presentation-overlay {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.pres-canvas {
  max-width: 100vw;
  max-height: 100vh;
  object-fit: contain;
}

.pres-hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  pointer-events: none;
  display: flex;
  gap: 20px;
}

.pres-page {
  color: rgba(255,255,255,0.6);
  font-weight: 600;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
