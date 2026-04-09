<template>
  <div
      :style="{ background: settings.wallpaper }"
      aria-label="Bureau Windows"
      class="desktop"
      role="application"
      @click="closeMenus"
      @contextmenu.prevent="onRightClick"
  >
    <!-- Desktop icons -->
    <ul aria-label="Icônes du bureau" class="desktop-icons">
      <li
          v-for="icon in desktopIcons"
          :key="icon.id"
          :style="{ position: 'absolute', left: icon.x + 'px', top: icon.y + 'px' }"
          class="desktop-icon-item"
      >
        <button
            :aria-label="icon.label"
            :aria-selected="selectedIcon === icon.id"
            :class="{ selected: selectedIcon === icon.id, dragging: draggingIcon === icon.id }"
            class="desktop-icon"
            @mousedown="onIconDragStart($event, icon)"
            @click.stop="selectedIcon = icon.id"
            @dblclick.stop="openApp(icon.appId)"
        >
          <img v-if="icon.icon.startsWith('/')" :src="icon.icon" alt="" aria-hidden="true" class="icon-glyph-img"
               height="48" width="48"/>
          <Icon v-else :name="icon.icon" aria-hidden="true" class="icon-glyph"/>
          <span aria-hidden="true" class="icon-label">{{ icon.label }}</span>
        </button>
      </li>
    </ul>

    <!-- Open windows -->
    <WinWindow
        v-for="win in windows"
        :key="win.id"
        :focusedId="focusedId"
        :win="win"
    >
      <component :is="appComponents[win.appId]" @changeBg="wallpaper = $event"/>
    </WinWindow>

    <!-- Taskbar -->
    <WinTaskbar
        :notifOpen="notifOpen"
        :qsOpen="qsOpen"
        :startOpen="startOpen"
        @toggleCalendar="toggleNotif"
        @toggleNotif="toggleNotif"
        @toggleQuickSettings="toggleQuickSettings"
        @toggleStart="toggleStart"
        @click.stop
    />

    <!-- Start menu -->
    <WinStartMenu :open="startOpen" @close="startOpen = false"/>

    <!-- Notification panel -->
    <WinNotificationCenter :open="notifOpen"/>

    <!-- Quick Actions Panel -->
    <WinQuickSettings :open="qsOpen" @openSettings="openApp('settings')"/>

    <!-- Context menu -->
    <WinContextMenu
        :items="ctxItems"
        :visible="ctxVisible"
        :x="ctxX"
        :y="ctxY"
        @close="ctxVisible = false"
    />
  </div>
</template>

<script lang="ts" setup>
import Notepad from '~/components/apps/Notepad.vue'
import Calculator from '~/components/apps/Calculator.vue'
import FileExplorer from '~/components/apps/FileExplorer.vue'
import Settings from '~/components/apps/Settings.vue'
import Photos from '~/components/apps/Photos.vue'
import PdfViewer from '~/components/apps/PdfViewer.vue'
import PdfViewer2 from '~/components/apps/PdfViewer2.vue'
import Edge from '~/components/apps/Edge.vue'

import {
  ICON_DESKTOP_CALC,
  ICON_DESKTOP_DOCS,
  ICON_DESKTOP_NOTEPAD,
  ICON_DESKTOP_PC,
  ICON_DESKTOP_PDF,
  ICON_DESKTOP_PHOTOS,
  ICON_DESKTOP_TRASH,
  ICON_FLUENT_DISPLAY,
  ICON_FLUENT_NEW_DOC,
  ICON_FLUENT_PERSONALIZE,
  ICON_FLUENT_REFRESH,
  ICON_FLUENT_SORT,
  ICON_FLUENT_VIEW,
} from '~/composables/icons'

definePageMeta({layout: false})

const {windows, openApp, focusWindow} = useWindows()
const {settings} = useSettings()

// Map app IDs to components
const appComponents: Record<string, any> = {
  notepad: Notepad,
  calculator: Calculator,
  explorer: FileExplorer,
  settings: Settings,
  photos: Photos,
  pdfviewer: PdfViewer,
  pdfviewer2: PdfViewer2,
  edge: Edge,
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
  {id: 'trash', appId: 'explorer', icon: ICON_DESKTOP_TRASH, label: 'Corbeille', x: 0, y: 0},
  {id: 'thispc', appId: 'explorer', icon: ICON_DESKTOP_PC, label: 'Ce PC', x: 0, y: 5},
  {id: 'explorer', appId: 'explorer', icon: ICON_DESKTOP_DOCS, label: 'Documents', x: 0, y: 0},
  {id: 'notepad', appId: 'notepad', icon: ICON_DESKTOP_NOTEPAD, label: 'Bloc-notes', x: 0, y: 0},
  {id: 'calc', appId: 'calculator', icon: ICON_DESKTOP_CALC, label: 'Calculatrice', x: 0, y: 0},
  {id: 'photos', appId: 'photos', icon: ICON_DESKTOP_PHOTOS, label: 'Photos', x: 0, y: 0},
  {id: 'pdf', appId: 'pdfviewer', icon: ICON_DESKTOP_PDF, label: 'Dossier_interne.pdf', x: 0, y: 0},
  {id: 'pdf2', appId: 'pdfviewer2', icon: ICON_DESKTOP_PDF, label: "Rapport_d'Autopsie.pdf", x: 0, y: 0},
])

function arrangeIcons() {
  const h = window.innerHeight - 60 // Taskbar + margin
  let currentX = GRID_OFFSET_X
  let currentY = GRID_OFFSET_Y

  desktopIcons.value.forEach(icon => {
    if (currentY + GRID_H > h) {
      currentX += GRID_W
      currentY = GRID_OFFSET_Y
    }
    icon.x = currentX
    icon.y = currentY
    currentY += GRID_H
  })
}

onMounted(() => {
  arrangeIcons()
  window.addEventListener('resize', arrangeIcons)
})

onUnmounted(() => {
  window.removeEventListener('resize', arrangeIcons)
})

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

const ctxItems = computed(() => [
  {
    label: 'Affichage', icon: ICON_FLUENT_VIEW, action: () => {
    }
  },
  {
    label: 'Trier par', icon: ICON_FLUENT_SORT, action: () => {
    }
  },
  {
    label: 'Actualiser', icon: ICON_FLUENT_REFRESH, action: () => {
    }
  },
  {separator: true},
  {label: 'Nouveau', icon: ICON_FLUENT_NEW_DOC, action: () => openApp('notepad')},
  {separator: true},
  {label: 'Personnaliser', icon: ICON_FLUENT_PERSONALIZE, action: () => openApp('settings')},
  {label: "Paramètres d'affichage", icon: ICON_FLUENT_DISPLAY, action: () => openApp('settings')},
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
  list-style: none;
  margin: 0;
}

.desktop-icon-item {
  pointer-events: auto;
}

.desktop-icon {
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

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  &.selected {
    background: rgba(255, 255, 255, 0.2);
  }

  &.dragging {
    opacity: 0.7;
    z-index: 1000;
    transition: none;
  }
}

.icon-glyph {
  font-size: 36px;
}

.icon-label {
  font-size: 12px;
  color: white;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.5);
  line-height: 1.3;
  max-width: 80px;
  overflow: visible;
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
