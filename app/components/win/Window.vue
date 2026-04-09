<template>
  <Transition name="win">
    <div
        v-if="!win.minimized"
        :aria-labelledby="`win-title-${win.id}`"
        :class="{ maximized: win.maximized, focused: isFocused }"
        :style="windowStyle"
        class="win-window"
        role="dialog"
        aria-modal="true"
        @mousedown="onFocus"
    >
      <!-- Title bar -->
      <div
          class="titlebar"
          @dblclick="onToggleMax"
          @mousedown.stop="onDragStart"
      >
        <div class="titlebar-left">
          <img v-if="appIcon.startsWith('/')" :alt="win.title" :src="appIcon" aria-hidden="true" class="app-icon-img"
               height="16" width="16"/>
          <Icon v-else :name="appIcon" aria-hidden="true" class="app-icon"/>
          <span :id="`win-title-${win.id}`" class="app-title">{{ win.title }}</span>
        </div>
        <div :aria-label="`Contrôles de la fenêtre ${win.title}`" class="titlebar-controls" role="group">
          <button
              :aria-label="`Réduire ${win.title}`"
              class="ctrl-btn btn-min"
              @mousedown.stop
              @click.stop="onMin"
          >
            <svg aria-hidden="true" focusable="false" height="1" viewBox="0 0 10 1" width="10">
              <rect fill="currentColor" height="1" width="10"/>
            </svg>
          </button>
          <button
              :aria-label="win.maximized ? `Restaurer ${win.title}` : `Agrandir ${win.title}`"
              :aria-pressed="win.maximized"
              class="ctrl-btn btn-max"
              @mousedown.stop
              @click.stop="onToggleMax"
          >
            <svg v-if="!win.maximized" aria-hidden="true" focusable="false" height="10" viewBox="0 0 10 10" width="10">
              <rect fill="none" height="10" stroke="currentColor" stroke-width="1" width="10" x="0" y="0"/>
            </svg>
            <svg v-else aria-hidden="true" focusable="false" height="10" viewBox="0 0 10 10" width="10">
              <rect fill="none" height="8" stroke="currentColor" stroke-width="1" width="8" x="2" y="0"/>
              <path d="M0 2v8h8" fill="none" stroke="currentColor" stroke-width="1"/>
            </svg>
          </button>
          <button
              :aria-label="`Fermer ${win.title}`"
              class="ctrl-btn btn-close"
              @mousedown.stop
              @click.stop="onClose"
          >
            <svg aria-hidden="true" focusable="false" height="10" viewBox="0 0 10 10" width="10">
              <line stroke="currentColor" stroke-width="1.2" x1="0" x2="10" y1="0" y2="10"/>
              <line stroke="currentColor" stroke-width="1.2" x1="10" x2="0" y1="0" y2="10"/>
            </svg>
          </button>
        </div>
      </div>
      <!-- Content -->
      <div class="win-content">
        <slot/>
      </div>

      <!-- Resize handles (masqués des technologies d'assistance) -->
      <template v-if="!win.maximized">
        <div aria-hidden="true" class="resizer n" @mousedown.stop="onResizeStart($event, 'n')"/>
        <div aria-hidden="true" class="resizer s" @mousedown.stop="onResizeStart($event, 's')"/>
        <div aria-hidden="true" class="resizer e" @mousedown.stop="onResizeStart($event, 'e')"/>
        <div aria-hidden="true" class="resizer w" @mousedown.stop="onResizeStart($event, 'w')"/>
        <div aria-hidden="true" class="resizer ne" @mousedown.stop="onResizeStart($event, 'ne')"/>
        <div aria-hidden="true" class="resizer nw" @mousedown.stop="onResizeStart($event, 'nw')"/>
        <div aria-hidden="true" class="resizer se" @mousedown.stop="onResizeStart($event, 'se')"/>
        <div aria-hidden="true" class="resizer sw" @mousedown.stop="onResizeStart($event, 'sw')"/>
      </template>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import type {WinInstance} from '~/composables/useWindows'
import {APPS} from '~/composables/useWindows'

const props = defineProps<{ win: WinInstance; focusedId?: string }>()
const {closeWindow, minimizeWindow, toggleMaximize, focusWindow, moveWindow, resizeWindow} = useWindows()

const isFocused = computed(() => !props.focusedId || props.focusedId === props.win.id)

const appIcon = computed(() =>
    APPS.find(a => a.id === props.win.appId)?.icon ?? 'fluent-color:document-24'
)

const windowStyle = computed(() => {
  if (props.win.maximized) {
    return {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '100vw',
      height: `calc(100vh - var(--taskbar-height))`,
      zIndex: props.win.zIndex,
      borderRadius: '0',
    }
  }
  return {
    position: 'fixed',
    left: `${props.win.x}px`,
    top: `${props.win.y}px`,
    width: `${props.win.width}px`,
    height: `${props.win.height}px`,
    zIndex: props.win.zIndex,
  }
})

function onFocus() {
  focusWindow(props.win.id)
}

function onMin() {
  minimizeWindow(props.win.id)
}

function onToggleMax() {
  toggleMaximize(props.win.id)
}

function onClose() {
  closeWindow(props.win.id)
}

function onDragStart(e: MouseEvent) {
  if (props.win.maximized) return
  focusWindow(props.win.id)
  const startX = e.clientX - props.win.x
  const startY = e.clientY - props.win.y

  function onMove(e: MouseEvent) {
    moveWindow(props.win.id, e.clientX - startX, Math.max(0, e.clientY - startY))
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
  e.preventDefault()
}

function onResizeStart(e: MouseEvent, dir: string) {
  focusWindow(props.win.id)
  const startX = e.clientX
  const startY = e.clientY
  const startW = props.win.width
  const startH = props.win.height
  const startXPos = props.win.x
  const startYPos = props.win.y

  function onMove(e: MouseEvent) {
    let newW = startW
    let newH = startH
    let newX = startXPos
    let newY = startYPos

    const dx = e.clientX - startX
    const dy = e.clientY - startY

    if (dir.includes('e')) newW = startW + dx
    if (dir.includes('w')) {
      newW = startW - dx
      newX = startXPos + dx
    }
    if (dir.includes('s')) newH = startH + dy
    if (dir.includes('n')) {
      newH = startH - dy
      newY = startYPos + dy
    }

    if (newW >= 200) {
      props.win.width = newW
      props.win.x = newX
    }
    if (newH >= 120) {
      props.win.height = newH
      props.win.y = newY
    }
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
  e.preventDefault()
}
</script>

<style scoped>
.win-window {
  position: fixed;
  display: flex;
  flex-direction: column;
  background: var(--window-bg);
  border: 1px solid rgba(0, 0, 0, 0.18);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: visible;
  min-width: 200px;
  min-height: 120px;

  &.maximized {
    border-radius: 0;
    border: none;
  }
}

.titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--titlebar-height);
  background: #202020;
  flex-shrink: 0;
  cursor: default;
  -webkit-user-select: none;
  user-select: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.win-window:not(.focused) .titlebar {
  background: #2d2d2d;
}

.titlebar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  overflow: hidden;
  flex: 1;
  min-width: 0;
}

.app-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.app-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.win-window:not(.focused) .app-title {
  color: rgba(255, 255, 255, 0.5);
}

.titlebar-controls {
  display: flex;
  flex-shrink: 0;
}

.ctrl-btn {
  width: 46px;
  height: var(--titlebar-height);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  transition: background 0.1s, color 0.1s;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: white;
  }
}

.btn-close:hover {
  background: #e81123 !important;
  color: white !important;
}

.win-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #191919;
}

/* Resizers */
.resizer {
  position: absolute;
  z-index: 10;
}

.resizer.n {
  top: -4px;
  left: 4px;
  right: 4px;
  height: 8px;
  cursor: n-resize;
}

.resizer.s {
  bottom: -4px;
  left: 4px;
  right: 4px;
  height: 8px;
  cursor: s-resize;
}

.resizer.e {
  right: -4px;
  top: 4px;
  bottom: 4px;
  width: 8px;
  cursor: e-resize;
}

.resizer.w {
  left: -4px;
  top: 4px;
  bottom: 4px;
  width: 8px;
  cursor: w-resize;
}

.resizer.nw {
  top: -4px;
  left: -4px;
  width: 12px;
  height: 12px;
  cursor: nw-resize;
}

.resizer.ne {
  top: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  cursor: ne-resize;
}

.resizer.sw {
  bottom: -4px;
  left: -4px;
  width: 12px;
  height: 12px;
  cursor: sw-resize;
}

.resizer.se {
  bottom: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  cursor: se-resize;
}

/* Transition */
.win-enter-active, .win-leave-active {
  transition: opacity 0.15s, transform 0.15s;
  transform-origin: center bottom;
}

.win-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.win-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
</style>
