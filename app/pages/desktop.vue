<template>
  <div
      :style="{ background: settings.wallpaper }"
      aria-label="Bureau Windows"
      class="desktop"
      role="application"
      @click="closeMenus"
      @contextmenu.prevent="onRightClick"
  >
    <a class="sr-only skip-link" href="#main-content">Aller au contenu principal</a>
    <h1 class="sr-only">Bureau — Windows 10</h1>
    <main id="main-content">
      <!-- Desktop icons -->
      <ul aria-label="Icônes du bureau" class="desktop-icons">
        <li
            v-for="icon in visibleDesktopIcons"
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
              @dblclick.stop="openAppWrapper(icon.appId)"
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
        <component
            :is="appComponents[win.appId]"
            :initialUrl="win.appId === 'edge' ? win.initialUrl : undefined"
            @changeBg="wallpaper = $event"
            @gmailUnlocked="onGmailUnlocked"
        />
      </WinWindow>
    </main>

    <!-- Notification pop-up -->
    <Transition name="slide-notif">
      <div v-if="notifVisible && gmailUnlockedInEdge" class="gmail-notif"
           @click="openAppWrapper('edge', 'https://www.gmail.com'); notifVisible = false">
        <div class="notif-header">
          <div class="notif-icon">✉</div>
          <div class="notif-app">Courrier</div>
          <button class="notif-close" @click.stop="notifVisible = false">✕</button>
        </div>
        <div class="notif-content">
          <div class="notif-title">Prof. Moriarty</div>
          <div class="notif-body">Vous devez me remettre le rapport du labo...</div>
        </div>
      </div>
    </Transition>

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
    <WinStartMenu :open="startOpen" @close="startOpen = false" @shutdown="onShutdown"/>

    <!-- Shutdown overlay -->
    <Transition name="shutdown">
      <div v-if="shutdownActive" aria-label="Cliquez pour rallumer" class="shutdown-overlay" role="button" tabindex="0"
           @click="onWakeUp" @keydown.enter="onWakeUp" @keydown.space.prevent="onWakeUp"/>
    </Transition>

    <!-- Boot screen -->
    <Transition name="boot-fade">
      <WinBootScreen v-if="bootActive" @done="onBootDone"/>
    </Transition>

    <!-- Notification panel -->
    <WinNotificationCenter :open="notifOpen"/>

    <!-- Quick Actions Panel -->
    <WinQuickSettings :open="qsOpen" @openSettings="openAppWrapper('settings')"/>

    <!-- Screen reader announcements -->
    <div aria-live="polite" class="sr-only" role="status">
      {{ announcement }}
    </div>


    <!-- Context menu -->
    <WinContextMenu
        :items="ctxItems"
        :visible="ctxVisible"
        :x="ctxX"
        :y="ctxY"
        @close="ctxVisible = false"
    />

    <!-- BSOD Easter Egg -->
    <Transition name="fade">
      <div v-if="bsodActive" class="bsod" @click="bsodActive = false">
        <div class="bsod-content">
          <div class="bsod-sad">:(</div>
          <h1>Your PC ran into a problem and needs to restart.</h1>
          <p>We're just collecting some error info, and then we'll restart for you.</p>
          <p class="bsod-pct">{{ bsodPct }}% complete</p>
          <div class="bsod-stop">
            <p>Stop code: MURDER_UNSOLVED_EXCEPTION</p>
            <p>If you'd like to know more, search online for: WHO_IS_THE_KILLER</p>
          </div>
          <p class="bsod-hint">(cliquez pour fermer)</p>
        </div>
      </div>
    </Transition>

    <!-- Konami confetti -->
    <Transition name="fade">
      <div v-if="konamiActive" class="konami-overlay" @click="konamiActive = false">
        <div class="konami-text">
          <div class="konami-title">KONAMI CODE ACTIVATED</div>
          <div class="konami-sub">God Mode: ON</div>
          <div class="konami-hint">Tous les indices ont été débloqués... ou pas.</div>
        </div>
        <div class="confetti-container">
          <div v-for="i in 50" :key="i" :style="confettiStyle(i)" class="confetti"/>
        </div>
      </div>
    </Transition>

    <!-- Clippy Easter Egg -->
    <Transition name="clippy-slide">
      <div v-if="clippyVisible" class="clippy" @click="dismissClippy">
        <div class="clippy-body">
          <div class="clippy-icon">📎</div>
          <div class="clippy-bubble">
            <div class="clippy-text">{{ clippyMessage }}</div>
            <button class="clippy-close" @click.stop="dismissClippy">✕</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Ghost notification -->
    <Transition name="slide-notif">
      <div v-if="ghostNotifVisible" class="gmail-notif ghost-notif" @click="ghostNotifVisible = false">
        <div class="notif-header">
          <div class="notif-icon" style="background: #e74856">💀</div>
          <div class="notif-app">WhatsApp</div>
          <button class="notif-close" @click.stop="ghostNotifVisible = false">✕</button>
        </div>
        <div class="notif-content">
          <div class="notif-title">Numéro inconnu</div>
          <div class="notif-body">Supprime tout. Maintenant.</div>
        </div>
      </div>
    </Transition>

    <!-- Screensaver -->
    <Transition name="fade">
      <div v-if="screensaverActive" class="screensaver" @click="screensaverActive = false"
           @keydown="screensaverActive = false" @mousemove="screensaverActive = false">
        <div :style="{ left: ssX + 'px', top: ssY + 'px' }" class="screensaver-text">
          35mm
        </div>
      </div>
    </Transition>
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
import Terminal from '~/components/apps/Terminal.vue'
import Paint from '~/components/apps/Paint.vue'

import {
  ICON_DESKTOP_CALC,
  ICON_DESKTOP_DOCS,
  ICON_DESKTOP_EDGE,
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

useHead({
  title: 'Bureau — 35mm'
})

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
  terminal: Terminal,
  paint: Paint,
}

const wallpaper = ref(
    'radial-gradient(ellipse 70% 55% at 20% 65%, rgba(74,144,217,0.25) 0%, transparent 60%), radial-gradient(ellipse 55% 70% at 80% 25%, rgba(83,52,131,0.3) 0%, transparent 60%), linear-gradient(155deg, #0d1b2e 0%, #112244 40%, #1a0d2e 70%, #0a1520 100%)'
)

const selectedIcon = ref('')
const shutdownActive = ref(false)
const bootActive = ref(false)
const unlockedStage = ref(0) // 0 = locked, 1 = consignes opened, 2 = rapport opened (full unlock)
const gmailUnlockedInEdge = ref(false)

function onShutdown() {
  closeMenus()
  shutdownActive.value = true
  setTimeout(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  }, 800)
}

function onWakeUp() {
  bootActive.value = true
  shutdownActive.value = false
}

function onBootDone() {
  bootActive.value = false
}

function onGmailUnlocked() {
  gmailUnlockedInEdge.value = true
}

const draggingIcon = ref('')
const startOpen = ref(false)
const notifOpen = ref(false)
const qsOpen = ref(false)
const ctxVisible = ref(false)
const ctxX = ref(0)
const ctxY = ref(0)
const announcement = ref('')
const notifVisible = ref(true)

// Watch windows to announce open/close
watch(() => windows.value.length, (newCount, oldCount) => {
  if (newCount > oldCount) {
    const last = windows.value[windows.value.length - 1]
    announcement.value = `Ouverture de la fenêtre ${last.title}`
  } else if (newCount < oldCount) {
    announcement.value = `Fermeture d'une fenêtre`
  }
})

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
  {id: 'thispc', appId: 'explorer', icon: ICON_DESKTOP_PC, label: 'Ce PC', x: 0, y: 5},
  {id: 'photos', appId: 'photos', icon: ICON_DESKTOP_PHOTOS, label: 'Photos', x: 0, y: 0},
  {id: 'pdf', appId: 'pdfviewer', icon: ICON_DESKTOP_PDF, label: 'Consignes.pdf', x: 0, y: 0},
  {id: 'pdf2', appId: 'pdfviewer2', icon: ICON_DESKTOP_PDF, label: "Rapport_Autopsie.pdf", x: 0, y: 0},
  {id: 'edge', appId: 'edge', icon: ICON_DESKTOP_EDGE, label: 'Microsoft Edge', x: 0, y: 0},
])

// Computed icons: progressive unlocking
// Stage 0: Only Consignes.pdf
// Stage 1: Consignes.pdf AND Rapport_Autopsie.pdf
// Stage 2: All applications
const visibleDesktopIcons = computed(() => {
  if (unlockedStage.value === 0) {
    return desktopIcons.value.filter(icon => icon.id === 'pdf')
  } else if (unlockedStage.value === 1) {
    return desktopIcons.value.filter(icon => icon.id === 'pdf' || icon.id === 'pdf2')
  }
  return desktopIcons.value
})

function arrangeIcons() {
  const h = window.innerHeight - 60 // Taskbar + margin
  let currentX = GRID_OFFSET_X
  let currentY = GRID_OFFSET_Y

  visibleDesktopIcons.value.forEach(icon => {
    if (currentY + GRID_H > h) {
      currentX += GRID_W
      currentY = GRID_OFFSET_Y
    }
    icon.x = currentX
    icon.y = currentY
    currentY += GRID_H
  })
}

function openAppWrapper(appId: string, initialUrl?: string) {
  // Stage 0: Only allow opening Consignes.pdf
  if (unlockedStage.value === 0 && appId !== 'pdfviewer') {
    return
  }

  // Stage 1: Allow opening both PDFs
  if (unlockedStage.value === 1 && appId !== 'pdfviewer' && appId !== 'pdfviewer2') {
    return
  }

  // Open the app
  openApp(appId, initialUrl)

  // If opening Consignes PDF and not already in stage 1, move to stage 1 (show both PDFs)
  if (appId === 'pdfviewer' && unlockedStage.value === 0) {
    setTimeout(() => {
      unlockedStage.value = 1
      arrangeIcons()
    }, 500)
  }

  // If opening Rapport_Autopsie PDF and not already in stage 2, move to stage 2 (full unlock)
  if (appId === 'pdfviewer2' && unlockedStage.value === 1) {
    setTimeout(() => {
      unlockedStage.value = 2
      arrangeIcons()
    }, 500)
  }
}

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
  {label: 'Nouveau', icon: ICON_FLUENT_NEW_DOC, action: () => openAppWrapper('notepad')},
  {separator: true},
  {label: 'Personnaliser', icon: ICON_FLUENT_PERSONALIZE, action: () => openAppWrapper('settings')},
  {label: "Paramètres d'affichage", icon: ICON_FLUENT_DISPLAY, action: () => openAppWrapper('settings')},
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

// ─── EASTER EGGS ─────────────────────────────────────────────────────────────

// 1. BSOD (Ctrl+Shift+B)
const bsodActive = ref(false)
const bsodPct = ref(0)

function triggerBsod() {
  bsodActive.value = true
  bsodPct.value = 0
  const interval = setInterval(() => {
    bsodPct.value += Math.floor(Math.random() * 15) + 5
    if (bsodPct.value >= 100) {
      bsodPct.value = 100
      clearInterval(interval)
    }
  }, 800)
}

// 2. Konami Code
const konamiActive = ref(false)
const konamiSeq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
let konamiIdx = 0

function confettiStyle(i: number) {
  const colors = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#00f', '#ff6600', '#ff3399']
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${2 + Math.random() * 3}s`,
    background: colors[i % colors.length],
  }
}

// 3. Clippy
const clippyVisible = ref(false)
const clippyMessage = ref('')
const clippyMessages = [
  'Il semblerait que vous essayez de faire quelque chose. Besoin d\'aide ?',
  'Avez-vous pensé à boire de l\'eau aujourd\'hui ?',
  'Conseil : appuyer sur les touches du clavier fait apparaître des lettres.',
  'Psst... votre chaise est peut-être mal réglée.',
  'N\'oubliez pas de cligner des yeux !',
  'Saviez-vous que les ordinateurs utilisent de l\'électricité ?',
  'Il fait peut-être chaud là où vous êtes. Ou froid. Je ne sais pas.',
  'Vous avez l\'air de regarder un écran en ce moment.',
  'Conseil : la souris se déplace quand vous la bougez.',
  'Pensez à vous lever toutes les heures. Ou pas.',
  'Il y a eu un meurtre. C\'est tout ce que je sais.',
  'Le coupable a des mains. Probablement.',
  'Conseil : les suspects sont souvent présents dans les enquêtes.',
  'Saviez-vous que les victimes de meurtre sont généralement mortes ?',
  'L\'arme du crime est quelque part. Bonne chance.',
]
let clippyDismissed = false

function showClippy() {
  if (clippyDismissed) return
  clippyMessage.value = clippyMessages[Math.floor(Math.random() * clippyMessages.length)]
  clippyVisible.value = true
}

function dismissClippy() {
  clippyVisible.value = false
  clippyDismissed = true
}

// 4. Ghost notification
const ghostNotifVisible = ref(false)

// 5. Screensaver
const screensaverActive = ref(false)
const ssX = ref(100)
const ssY = ref(100)
let ssIntervalId: ReturnType<typeof setInterval> | null = null
let inactivityTimer: ReturnType<typeof setTimeout> | null = null
let ssDx = 2
let ssDy = 1.5

function resetInactivity() {
  if (screensaverActive.value) return
  if (inactivityTimer) clearTimeout(inactivityTimer)
  inactivityTimer = setTimeout(() => {
    screensaverActive.value = true
    startScreensaverAnimation()
  }, 60000) // 60 seconds
}

function startScreensaverAnimation() {
  ssX.value = Math.random() * (window.innerWidth - 200)
  ssY.value = Math.random() * (window.innerHeight - 60)
  ssIntervalId = setInterval(() => {
    ssX.value += ssDx
    ssY.value += ssDy
    if (ssX.value <= 0 || ssX.value >= window.innerWidth - 200) ssDx = -ssDx
    if (ssY.value <= 0 || ssY.value >= window.innerHeight - 60) ssDy = -ssDy
  }, 16)
}

watch(screensaverActive, (val) => {
  if (!val && ssIntervalId) {
    clearInterval(ssIntervalId)
    ssIntervalId = null
    resetInactivity()
  }
})

// Keyboard listener for BSOD + Konami
function onGlobalKeydown(e: KeyboardEvent) {
  resetInactivity()

  // BSOD: Ctrl+Shift+B
  if (e.ctrlKey && e.shiftKey && e.key === 'B') {
    e.preventDefault()
    triggerBsod()
    return
  }

  // Konami code
  if (e.key === konamiSeq[konamiIdx]) {
    konamiIdx++
    if (konamiIdx === konamiSeq.length) {
      konamiActive.value = true
      konamiIdx = 0
      setTimeout(() => konamiActive.value = false, 5000)
    }
  } else {
    konamiIdx = 0
  }
}

const { addNotification } = useNotifications()

onMounted(() => {
  arrangeIcons()
  window.addEventListener('resize', arrangeIcons)
  window.addEventListener('keydown', onGlobalKeydown)
  window.addEventListener('mousemove', resetInactivity)
  window.addEventListener('click', resetInactivity)
  resetInactivity()

  // Clippy appears after 45 seconds
  setTimeout(() => showClippy(), 45000)

  // Initial mail notification after 5 seconds
  setTimeout(() => {
    notifVisible.value = true
    addNotification({
      app: 'Courrier',
      title: 'Prof. Moriarty',
      message: 'Vous devez me remettre le rapport du labo...',
      icon: 'fluent:mail-24-regular'
    })
  }, 5000)

  // Ghost notification after 2 minutes

})

onUnmounted(() => {
  window.removeEventListener('resize', arrangeIcons)
  window.removeEventListener('keydown', onGlobalKeydown)
  window.removeEventListener('mousemove', resetInactivity)
  window.removeEventListener('click', resetInactivity)
  if (inactivityTimer) clearTimeout(inactivityTimer)
  if (ssIntervalId) clearInterval(ssIntervalId)
})
</script>

<style scoped>
.gmail-notif {
  position: absolute;
  bottom: calc(var(--taskbar-height) + 12px);
  right: 12px;
  background: rgba(31, 31, 31, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  width: 360px;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  font-family: 'Segoe UI', system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 8px;
  animation: slideIn 0.35s cubic-bezier(0.1, 0.9, 0.2, 1);

  @keyframes slideIn {
    from {
      transform: translateX(120%);
    }
    to {
      transform: translateX(0);
    }
  }

  .notif-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
  }

  .notif-icon {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    flex-shrink: 0;
  }

  .notif-app {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .notif-close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    font-size: 12px;
    padding: 4px;
    margin-top: -4px;
    margin-right: -4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }

  .notif-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .notif-title {
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .notif-body {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.85);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

main#main-content {
  position: absolute;
  inset: 0;
}

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

.boot-fade-leave-active {
  transition: opacity 0.5s ease;
}

.boot-fade-leave-to {
  opacity: 0;
}

.shutdown-overlay {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 99999;
}

.shutdown-enter-active {
  transition: opacity 0.8s ease;
}

.shutdown-leave-active {
  transition: opacity 0.6s ease;
}

.shutdown-enter-from,
.shutdown-leave-to {
  opacity: 0;
}

.shutdown-enter-to,
.shutdown-leave-from {
  opacity: 1;
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

/* ─── BSOD ─────────────────────────────────────────────────── */
.bsod {
  position: fixed;
  inset: 0;
  background: #0078d7;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.bsod-content {
  color: white;
  max-width: 600px;
  font-family: 'Segoe UI', sans-serif;
}

.bsod-sad {
  font-size: 120px;
  font-weight: 100;
  margin-bottom: 20px;
}

.bsod-content h1 {
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 12px;
}

.bsod-content p {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.6;
}

.bsod-pct {
  margin-top: 24px;
}

.bsod-stop {
  margin-top: 40px;
  font-size: 12px !important;
  opacity: 0.8;
}

.bsod-stop p {
  font-size: 12px;
}

.bsod-hint {
  margin-top: 24px;
  font-size: 11px !important;
  opacity: 0.5;
}

/* ─── Konami ───────────────────────────────────────────────── */
.konami-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 999998;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.konami-text {
  text-align: center;
  z-index: 2;
}

.konami-title {
  font-size: 48px;
  font-weight: 800;
  color: #ff0;
  text-shadow: 0 0 30px rgba(255, 255, 0, 0.5);
  animation: pulse 0.5s ease infinite alternate;
}

.konami-sub {
  font-size: 24px;
  color: #0f0;
  margin-top: 12px;
}

.konami-hint {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 20px;
}

@keyframes pulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}

.confetti-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.confetti {
  position: absolute;
  top: -10px;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  animation: confettiFall linear forwards;
}

@keyframes confettiFall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* ─── Clippy ───────────────────────────────────────────────── */
.clippy {
  position: fixed;
  bottom: 70px;
  right: 20px;
  z-index: 10000;
  cursor: pointer;
}

.clippy-body {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.clippy-icon {
  font-size: 48px;
  animation: clippyBounce 1s ease infinite;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

@keyframes clippyBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.clippy-bubble {
  background: #fffde0;
  border: 1px solid #d4c85e;
  border-radius: 8px;
  padding: 12px 16px;
  max-width: 280px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  position: relative;
}

.clippy-text {
  font-size: 13px;
  color: #333;
  line-height: 1.4;
}

.clippy-close {
  position: absolute;
  top: 4px;
  right: 8px;
  background: none;
  border: none;
  font-size: 14px;
  color: #999;
  cursor: pointer;

  &:hover {
    color: #333;
  }
}

.clippy-slide-enter-active {
  transition: all 0.4s ease;
}

.clippy-slide-leave-active {
  transition: all 0.3s ease;
}

.clippy-slide-enter-from {
  transform: translateX(100px) translateY(50px);
  opacity: 0;
}

.clippy-slide-leave-to {
  transform: translateY(50px);
  opacity: 0;
}

/* ─── Ghost notification ──────────────────────────────────── */
.slide-notif-enter-active {
  transition: all 0.35s cubic-bezier(0.1, 0.9, 0.2, 1);
}

.slide-notif-leave-active {
  transition: all 0.25s ease-in;
}

.slide-notif-enter-from {
  transform: translateX(120%);
}

.slide-notif-leave-to {
  transform: translateX(120%);
  opacity: 0;
}

/* ─── Screensaver ─────────────────────────────────────────── */
.screensaver {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 99998;
  cursor: none;
}

.screensaver-text {
  position: absolute;
  font-size: 42px;
  font-weight: 700;
  color: #0078d4;
  text-shadow: 0 0 20px rgba(0, 120, 212, 0.5);
  white-space: nowrap;
  transition: none;
}

/* ─── Shared transitions ──────────────────────────────────── */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
