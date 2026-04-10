<template>
  <div class="paint">
    <!-- Toolbar -->
    <div class="paint-toolbar">
      <div class="tool-group">
        <button v-for="tool in tools" :key="tool.id" :class="{ active: activeTool === tool.id }"
                :title="tool.label" class="tool-btn" @click="activeTool = tool.id">
          <span class="tool-icon">{{ tool.icon }}</span>
        </button>
      </div>
      <div class="separator"/>
      <div class="color-palette">
        <div v-for="color in colors" :key="color" :class="{ active: activeColor === color }"
             :style="{ background: color }" class="color-swatch" @click="activeColor = color"/>
      </div>
      <div class="separator"/>
      <div class="size-group">
        <label class="size-label">Taille:</label>
        <input v-model.number="brushSize" class="size-slider" max="20" min="1" type="range"/>
        <span class="size-value">{{ brushSize }}px</span>
      </div>
      <div class="separator"/>
      <button class="tool-btn" title="Effacer tout" @click="clearCanvas">
        <span class="tool-icon">🗑</span>
      </button>
    </div>

    <!-- Canvas -->
    <div class="canvas-container">
      <canvas ref="canvasEl" class="paint-canvas"
              @mousedown="startDraw"
              @mousemove="draw"
              @mouseup="stopDraw"
              @mouseleave="stopDraw"/>
    </div>

    <!-- Status bar -->
    <div class="paint-status">
      <span>{{ canvasWidth }} x {{ canvasHeight }}px</span>
      <span>Outil: {{ tools.find(t => t.id === activeTool)?.label }}</span>
      <span :style="{ color: activeColor }">Couleur: {{ activeColor }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const canvasEl = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const activeTool = ref('pencil')
const activeColor = ref('#000000')
const brushSize = ref(3)
const canvasWidth = ref(800)
const canvasHeight = ref(500)

const tools = [
  {id: 'pencil', icon: '✏', label: 'Crayon'},
  {id: 'eraser', icon: '🧹', label: 'Gomme'},
  {id: 'line', icon: '📏', label: 'Ligne'},
]

const colors = [
  '#000000', '#808080', '#800000', '#ff0000',
  '#ff6600', '#ffff00', '#00ff00', '#008000',
  '#00ffff', '#0000ff', '#800080', '#ff00ff',
  '#ffffff', '#c0c0c0', '#ff9999', '#ffcc99',
]

let ctx: CanvasRenderingContext2D | null = null
let lastX = 0
let lastY = 0

onMounted(() => {
  const canvas = canvasEl.value
  if (!canvas) return

  const container = canvas.parentElement
  if (container) {
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight
    canvasWidth.value = canvas.width
    canvasHeight.value = canvas.height
  }

  ctx = canvas.getContext('2d')
  if (!ctx) return

  // Draw the pre-loaded suspect sketch
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  drawSuspectSketch(ctx, canvas.width, canvas.height)
})

function drawSuspectSketch(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2
  const cy = h / 2

  // Title
  ctx.fillStyle = '#cc0000'
  ctx.font = 'bold 18px Segoe UI'
  ctx.textAlign = 'center'
  ctx.fillText('SUSPECT PRINCIPAL', cx, 40)

  // Head
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(cx, cy - 40, 45, 55, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Eyes
  ctx.beginPath()
  ctx.arc(cx - 16, cy - 52, 5, 0, Math.PI * 2)
  ctx.arc(cx + 16, cy - 52, 5, 0, Math.PI * 2)
  ctx.fill()

  // Question mark
  ctx.fillStyle = '#cc0000'
  ctx.font = 'bold 60px Segoe UI'
  ctx.fillText('?', cx, cy - 20)

  // Body
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx, cy + 15)
  ctx.lineTo(cx, cy + 100)
  ctx.moveTo(cx - 40, cy + 50)
  ctx.lineTo(cx + 40, cy + 50)
  ctx.moveTo(cx, cy + 100)
  ctx.lineTo(cx - 30, cy + 160)
  ctx.moveTo(cx, cy + 100)
  ctx.lineTo(cx + 30, cy + 160)
  ctx.stroke()

  // Arrow pointing
  ctx.fillStyle = '#cc0000'
  ctx.font = '14px Segoe UI'
  ctx.textAlign = 'left'
  ctx.fillText('← Qui est-ce ?', cx + 60, cy - 40)

  // Bottom note
  ctx.fillStyle = '#666'
  ctx.font = 'italic 12px Segoe UI'
  ctx.textAlign = 'center'
  ctx.fillText('Croquis réalisé à partir des témoignages - Ne pas diffuser', cx, h - 20)
}

function getPos(e: MouseEvent) {
  const rect = canvasEl.value!.getBoundingClientRect()
  return {x: e.clientX - rect.left, y: e.clientY - rect.top}
}

function startDraw(e: MouseEvent) {
  isDrawing.value = true
  const pos = getPos(e)
  lastX = pos.x
  lastY = pos.y

  if (activeTool.value === 'pencil' || activeTool.value === 'eraser') {
    ctx!.beginPath()
    ctx!.moveTo(lastX, lastY)
  }
}

function draw(e: MouseEvent) {
  if (!isDrawing.value || !ctx) return
  const pos = getPos(e)

  if (activeTool.value === 'pencil') {
    ctx.strokeStyle = activeColor.value
    ctx.lineWidth = brushSize.value
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  } else if (activeTool.value === 'eraser') {
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = brushSize.value * 3
    ctx.lineCap = 'round'
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  lastX = pos.x
  lastY = pos.y
}

function stopDraw() {
  if (!isDrawing.value || !ctx) return

  if (activeTool.value === 'line') {
    const pos = {x: lastX, y: lastY}
    ctx.strokeStyle = activeColor.value
    ctx.lineWidth = brushSize.value
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(lastX, lastY)
    ctx.stroke()
  }

  isDrawing.value = false
}

function clearCanvas() {
  if (!ctx || !canvasEl.value) return
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvasEl.value.width, canvasEl.value.height)
}
</script>

<style scoped>
.paint {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f0f0f0;
}

.paint-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f8f8f8;
  border-bottom: 1px solid #d0d0d0;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.tool-group {
  display: flex;
  gap: 2px;
}

.tool-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  transition: background 0.1s;
  cursor: pointer;

  &:hover {
    background: rgba(0, 120, 212, 0.1);
  }

  &.active {
    background: rgba(0, 120, 212, 0.2);
    outline: 1px solid #0078d4;
  }
}

.tool-icon {
  font-size: 16px;
}

.separator {
  width: 1px;
  height: 28px;
  background: #d0d0d0;
}

.color-palette {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  max-width: 200px;
}

.color-swatch {
  width: 18px;
  height: 18px;
  border: 1px solid #999;
  cursor: pointer;
  border-radius: 2px;

  &.active {
    outline: 2px solid #0078d4;
    outline-offset: 1px;
  }
}

.size-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.size-label {
  font-size: 11px;
  color: #555;
}

.size-slider {
  width: 80px;
  accent-color: #0078d4;
}

.size-value {
  font-size: 11px;
  color: #555;
  min-width: 30px;
}

.canvas-container {
  flex: 1;
  overflow: hidden;
  background: #808080;
  display: flex;
  align-items: center;
  justify-content: center;
}

.paint-canvas {
  background: white;
  cursor: crosshair;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.paint-status {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 3px 12px;
  font-size: 11px;
  color: #555;
  border-top: 1px solid #d0d0d0;
  background: #f5f5f5;
  flex-shrink: 0;
}
</style>
