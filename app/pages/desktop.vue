<template>
  <div
    class="desktop"
    :style="{ background: wallpaper }"
    @click="closeMenus"
    @contextmenu.prevent="onRightClick"
  >
    <!-- Desktop icons -->
    <div class="desktop-icons">
      <button
        v-for="icon in desktopIcons"
        :key="icon.id"
        class="desktop-icon"
        :class="{ selected: selectedIcon === icon.id, dragging: draggingIcon === icon.id }"
        :style="{ position: 'absolute', left: icon.x + 'px', top: icon.y + 'px' }"
        @mousedown="onIconDragStart($event, icon)"
        @click.stop="selectedIcon = icon.id"
        @dblclick.stop="openApp(icon.appId)"
      >
        <img v-if="icon.icon.startsWith('/')" :src="icon.icon" width="48" height="48" class="icon-glyph-img" alt="" />
        <Icon v-else :name="icon.icon" class="icon-glyph" />
        <span class="icon-label">{{ icon.label }}</span>
      </button>
    </div>

    <!-- Open windows -->
    <WinWindow
      v-for="win in windows"
      :key="win.id"
      :win="win"
      :focusedId="focusedId"
    >
      <component :is="appComponents[win.appId]" @changeBg="wallpaper = $event" />
    </WinWindow>

    <!-- Taskbar -->
    <WinTaskbar 
      :startOpen="startOpen" 
      :notifOpen="notifOpen"
      :qsOpen="qsOpen"
      @toggleStart="toggleStart" 
      @toggleNotif="toggleNotif" 
      @toggleQuickSettings="toggleQuickSettings"
      @toggleCalendar="toggleNotif"
    />

    <!-- Start menu -->
    <WinStartMenu :open="startOpen" @close="startOpen = false" />

    <!-- Notification panel (simplified version for now) -->
    <Transition name="slide-right">
      <div v-if="notifOpen" class="notif-panel" @click.stop>
        <div class="notif-header">
          <span>Notifications</span>
          <button @click="notifications = []">Effacer tout</button>
        </div>
        <div v-if="!notifications.length" class="notif-empty">
          <Icon :name="ICON_FLUENT_ALERT_OFF" size="48" style="color: rgba(255,255,255,0.3)" />
          <p>Pas de nouvelles notifications</p>
        </div>
        <div v-for="(n, i) in notifications" :key="i" class="notif-item">
          <div class="notif-app">{{ n.app }}</div>
          <div class="notif-msg">{{ n.message }}</div>
        </div>
      </div>
    </Transition>

    <!-- Quick Actions Panel -->
    <Transition name="slide-up">
      <div v-if="qsOpen" class="qs-panel" @click.stop>
        <div class="quick-actions">
          <div class="qa-grid">
            <button v-for="qa in quickActions" :key="qa.label" class="qa-btn" :class="{ on: qa.on }" @click="qa.on = !qa.on">
              <Icon :name="qa.icon" class="qa-icon" />
              <span class="qa-label">{{ qa.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Context menu -->
    <WinContextMenu
      :visible="ctxVisible"
      :x="ctxX"
      :y="ctxY"
      :items="ctxItems"
      @close="ctxVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import Notepad from '~/components/apps/Notepad.vue'
import Calculator from '~/components/apps/Calculator.vue'
import FileExplorer from '~/components/apps/FileExplorer.vue'
import Settings from '~/components/apps/Settings.vue'
import Photos from '~/components/apps/Photos.vue'

import {
  ICON_DESKTOP_PC,
  ICON_DESKTOP_DOCS,
  ICON_DESKTOP_NOTEPAD,
  ICON_DESKTOP_CALC,
  ICON_DESKTOP_SETTINGS,
  ICON_DESKTOP_PHOTOS,
  ICON_DESKTOP_TRASH,
  ICON_FLUENT_WIFI,
  ICON_FLUENT_BLUETOOTH,
  ICON_FLUENT_AIRPLANE,
  ICON_FLUENT_DND,
  ICON_FLUENT_FLASHLIGHT,
  ICON_FLUENT_EASE,
  ICON_FLUENT_PROJECT,
  ICON_FLUENT_BATTERY,
  ICON_FLUENT_VIEW,
  ICON_FLUENT_SORT,
  ICON_FLUENT_REFRESH,
  ICON_FLUENT_NEW_DOC,
  ICON_FLUENT_PERSONALIZE,
  ICON_FLUENT_DISPLAY,
  ICON_FLUENT_ALERT_OFF,
  ICON_APP_EDGE_LOGO,
} from '~/composables/icons'

definePageMeta({ layout: false })

const { windows, openApp, focusWindow } = useWindows()

// Map app IDs to components
const appComponents: Record<string, any> = {
  notepad: Notepad,
  calculator: Calculator,
  explorer: FileExplorer,
  settings: Settings,
  photos: Photos,
  edge: { template: `<div class="edge-placeholder"><div class="edge-bar"><span><Icon :name="ICON_APP_EDGE_LOGO" /></span><div class="edge-url">https://www.bing.com</div></div><div class="edge-content"><h2>Microsoft Edge</h2><p>Navigateur simulé</p></div></div>`, styles: [] },
}

const wallpaper = ref(
  'radial-gradient(ellipse 70% 55% at 20% 65%, rgba(74,144,217,0.25) 0%, transparent 60%), radial-gradient(ellipse 55% 70% at 80% 25%, rgba(83,52,131,0.3) 0%, transparent 60%), linear-gradient(155deg, #0d1b2e 0%, #112244 40%, #1a0d2e 70%, #0a1520 100%)'
)

const selectedIcon = ref('')
const draggingIcon = ref('')
const startOpen = ref(false)
const notifOpen = ref(false)
const qsOpen = ref(false)
const ctxVisible = ref(false)
const ctxX = ref(0)
const ctxY = ref(0)

// Grid constants for desktop icons
const GRID_W = 80
const GRID_H = 104
const GRID_OFFSET_X = 6
const GRID_OFFSET_Y = 6

const focusedId = computed(() => {
  const visible = windows.value.filter(w => !w.minimized)
  if (!visible.length) return ''
  return visible.reduce((a, b) => a.zIndex > b.zIndex ? a : b).id
})

const desktopIcons = ref([
  { id: 'thispc', appId: 'explorer', icon: ICON_DESKTOP_PC, label: 'Ce PC', x: GRID_OFFSET_X, y: GRID_OFFSET_Y },
  { id: 'explorer', appId: 'explorer', icon: ICON_DESKTOP_DOCS, label: 'Documents', x: GRID_OFFSET_X, y: GRID_OFFSET_Y + GRID_H },
  { id: 'notepad', appId: 'notepad', icon: ICON_DESKTOP_NOTEPAD, label: 'Bloc-notes', x: GRID_OFFSET_X, y: GRID_OFFSET_Y + GRID_H * 2 },
  { id: 'calc', appId: 'calculator', icon: ICON_DESKTOP_CALC, label: 'Calculatrice', x: GRID_OFFSET_X, y: GRID_OFFSET_Y + GRID_H * 3 },
  { id: 'settings', appId: 'settings', icon: ICON_DESKTOP_SETTINGS, label: 'Paramètres', x: GRID_OFFSET_X, y: GRID_OFFSET_Y + GRID_H * 4 },
  { id: 'photos', appId: 'photos', icon: ICON_DESKTOP_PHOTOS, label: 'Photos', x: GRID_OFFSET_X, y: GRID_OFFSET_Y + GRID_H * 5 },
  { id: 'trash', appId: 'explorer', icon: ICON_DESKTOP_TRASH, label: 'Corbeille', x: GRID_OFFSET_X, y: GRID_OFFSET_Y + GRID_H * 6 },
])

function onIconDragStart(e: MouseEvent, icon: any) {
  if (e.button !== 0) return // Only left click
  
  selectedIcon.value = icon.id
  draggingIcon.value = icon.id
  const startX = e.clientX - icon.x
  const startY = e.clientY - icon.y

  // Prevent selection/native drag which can cause icons to get stuck
  e.preventDefault()

  function onMove(e: MouseEvent) {
    icon.x = e.clientX - startX
    icon.y = e.clientY - startY
  }

  function onUp() {
    draggingIcon.value = ''
    
    // Snap to grid
    icon.x = Math.round((icon.x - GRID_OFFSET_X) / GRID_W) * GRID_W + GRID_OFFSET_X
    icon.y = Math.round((icon.y - GRID_OFFSET_Y) / GRID_H) * GRID_H + GRID_OFFSET_Y

    // Basic bounds check
    icon.x = Math.max(GRID_OFFSET_X, icon.x)
    icon.y = Math.max(GRID_OFFSET_Y, icon.y)

    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

const notifications = ref([
  { app: 'Windows Update', message: 'Des mises à jour sont disponibles.' },
  { app: 'Sécurité Windows', message: 'Votre appareil est protégé.' },
])

const quickActions = ref([
  { icon: ICON_FLUENT_WIFI, label: 'Wi-Fi', on: true },
  { icon: ICON_FLUENT_BLUETOOTH, label: 'Bluetooth', on: false },
  { icon: ICON_FLUENT_AIRPLANE, label: 'Mode avion', on: false },
  { icon: ICON_FLUENT_DND, label: 'Ne pas déranger', on: false },
  { icon: ICON_FLUENT_FLASHLIGHT, label: 'Lampe torche', on: false },
  { icon: ICON_FLUENT_EASE, label: 'Facilité d\'accès', on: false },
  { icon: ICON_FLUENT_PROJECT, label: 'Projeter', on: false },
  { icon: ICON_FLUENT_BATTERY, label: 'Économiseur', on: false },
])

const ctxItems = computed(() => [
  { label: 'Affichage', icon: ICON_FLUENT_VIEW, action: () => {} },
  { label: 'Trier par', icon: ICON_FLUENT_SORT, action: () => {} },
  { label: 'Actualiser', icon: ICON_FLUENT_REFRESH, action: () => {} },
  { separator: true },
  { label: 'Nouveau', icon: ICON_FLUENT_NEW_DOC, action: () => openApp('notepad') },
  { separator: true },
  { label: 'Personnaliser', icon: ICON_FLUENT_PERSONALIZE, action: () => openApp('settings') },
  { label: 'Paramètres d\'affichage', icon: ICON_FLUENT_DISPLAY, action: () => openApp('settings') },
])


function onRightClick(e: MouseEvent) {
  selectedIcon.value = ''
  ctxX.value = e.clientX
  ctxY.value = e.clientY
  ctxVisible.value = true
}

function toggleStart() {
  startOpen.value = !startOpen.value
  if (startOpen.value) {
    notifOpen.value = false
    qsOpen.value = false
  }
}

function toggleNotif() {
  notifOpen.value = !notifOpen.value
  if (notifOpen.value) {
    startOpen.value = false
    qsOpen.value = false
  }
}

function toggleQuickSettings() {
  qsOpen.value = !qsOpen.value
  if (qsOpen.value) {
    startOpen.value = false
    notifOpen.value = false
  }
}

function closeMenus() {
  startOpen.value = false
  notifOpen.value = false
  qsOpen.value = false
  ctxVisible.value = false
  selectedIcon.value = ''
}
</script>

<style scoped>
.desktop {
  position: fixed;
  inset: 0;
  overflow: hidden;
  padding-bottom: var(--taskbar-height);
  background-size: cover;
  background-position: center;
  transition: background 0.5s;
}

.desktop-icons {
  position: absolute;
  inset: 0;
  pointer-events: none;
  padding: 12px;
}

.desktop-icon {
  position: absolute;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 4px;
  width: 80px;
  cursor: default;
  transition: background 0.1s;
  user-select: none;

  &:hover { background: rgba(255,255,255,0.12); }
  &.selected { background: rgba(255,255,255,0.2); }
  &.dragging {
    opacity: 0.7;
    z-index: 1000;
    transition: none;
  }
}

.icon-glyph { font-size: 36px; }

.icon-label {
  font-size: 12px;
  color: white;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5);
  line-height: 1.3;
  max-width: 72px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Panels */
.notif-panel, .qs-panel {
  position: fixed;
  right: 12px;
  bottom: calc(var(--taskbar-height) + 12px);
  width: 360px;
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  z-index: 7500;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

.notif-panel {
  height: calc(100vh - var(--taskbar-height) - 24px);
  top: 12px;
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px 12px;
  font-size: 14px;
  font-weight: 600;
  color: white;

  button {
    font-size: 12px;
    color: var(--accent);
    &:hover { text-decoration: underline; }
  }
}

.notif-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: rgba(255,255,255,0.4);
  font-size: 13px;
}

.notif-item {
  margin: 4px 8px;
  padding: 12px;
  background: rgba(255,255,255,0.06);
  border-radius: 6px;
}

.notif-app { font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 4px; }
.notif-msg { font-size: 13px; color: rgba(255,255,255,0.9); }

.qs-panel {
  width: 320px;
  padding: 16px;
}

.qa-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.qa-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 4px;
  border-radius: 4px;
  background: rgba(255,255,255,0.06);
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.12); }
  &.on { background: var(--accent); }

  .qa-icon { font-size: 20px; }
  .qa-label { font-size: 11px; color: white; }
}

/* Edge placeholder */
:deep(.edge-placeholder) {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
}
:deep(.edge-bar) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f3f3f3;
  border-bottom: 1px solid #d0d0d0;
}
:deep(.edge-url) {
  flex: 1;
  padding: 4px 10px;
  background: white;
  border: 1px solid #c0c0c0;
  border-radius: 12px;
  font-size: 12px;
  color: #333;
}
:deep(.edge-content) {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
}

/* Transitions */
.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.25s cubic-bezier(0.1, 0.9, 0.2, 1);
}
.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(380px);
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.25s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.2s;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
