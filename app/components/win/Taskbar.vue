<template>
  <div class="taskbar">
    <!-- Start button -->
    <button class="start-btn" :class="{ active: startOpen }" @click="$emit('toggleStart')">
      <img :src="ICON_TASKBAR_START" width="18" height="18" alt="Start" />
    </button>

    <!-- Search -->
    <div class="search-bar" @click="$emit('openApp', 'edge')">
      <img :src="ICON_TASKBAR_SEARCH" width="14" height="14" style="opacity: 0.6" alt="Search" />
      <span>Rechercher dans Windows</span>
    </div>

    <!-- Task view button -->
    <button class="icon-btn taskview-btn" title="Vue des tâches">
      <img :src="ICON_TASKBAR_TASKVIEW" width="16" height="16" style="filter: invert(1)" alt="Task View" />
    </button>

    <!-- Pinned + Running apps -->
    <div class="tasks">
      <!-- Pinned apps -->
      <button
        v-for="app in APPS"
        :key="app.id"
        class="task-btn"
        :class="{ active: isFocused(app.id), running: isRunning(app.id) }"
        :title="app.name"
        @click="handleTaskClick(app.id)"
      >
        <img v-if="app.icon.startsWith('/')" :src="app.icon" width="18" height="18" class="task-icon-img" alt="" />
        <Icon v-else :name="app.icon" class="task-icon" />
        <span v-if="isRunning(app.id)" class="task-indicator" />
      </button>
    </div>

    <div class="spacer" />

    <!-- System tray -->
    <div class="tray">
      <button class="tray-btn" title="Afficher les icônes masquées">
        <img :src="ICON_TRAY_EXPAND" width="14" height="14" style="filter: invert(1); opacity: 0.7" alt="Expand" />
      </button>
      <!-- Network -->
      <button class="tray-btn" :class="{ active: qsOpen }" title="Réseau" @click="$emit('toggleQuickSettings')">
        <img :src="ICON_TRAY_NETWORK" width="16" height="16" style="filter: invert(1); opacity: 0.85" alt="Network" />
      </button>
      <!-- Sound -->
      <button class="tray-btn" :class="{ active: qsOpen }" title="Volume" @click="$emit('toggleQuickSettings')">
        <img :src="ICON_TRAY_VOLUME" width="16" height="16" style="filter: invert(1); opacity: 0.85" alt="Volume" />
      </button>
      <!-- Battery -->
      <button class="tray-btn" :class="{ active: qsOpen }" title="Batterie" @click="$emit('toggleQuickSettings')">
        <img :src="ICON_TRAY_BATTERY" width="16" height="16" style="filter: invert(1); opacity: 0.85" alt="Battery" />
      </button>

      <!-- Clock -->
      <button class="clock-btn" :class="{ active: notifOpen }" @click="$emit('toggleCalendar')">
        <div class="clock-time">{{ time }}</div>
        <div class="clock-date">{{ dateShort }}</div>
      </button>

      <!-- Notification center -->
      <button class="icon-btn notif-btn" :class="{ active: notifOpen }" title="Centre de notifications" @click="$emit('toggleNotif')">
        <img :src="ICON_TRAY_NOTIFICATIONS" width="16" height="16" style="filter: invert(1); opacity: 0.85" alt="Notifications" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { APPS } from '~/composables/useWindows'
import {
  ICON_TASKBAR_START,
  ICON_TASKBAR_SEARCH,
  ICON_TASKBAR_TASKVIEW,
  ICON_TRAY_EXPAND,
  ICON_TRAY_NETWORK,
  ICON_TRAY_VOLUME,
  ICON_TRAY_BATTERY,
  ICON_TRAY_NOTIFICATIONS,
} from '~/composables/icons'

defineEmits<{
  toggleStart: []
  openApp: [id: string]
  toggleNotif: []
  toggleQuickSettings: []
  toggleCalendar: []
}>()

defineProps<{ 
  startOpen?: boolean
  qsOpen?: boolean
  notifOpen?: boolean
}>()

const { taskbarWindows, openApp, focusWindow, minimizeWindow } = useWindows()

function isRunning(appId: string) {
  return taskbarWindows.value.some(w => w.appId === appId)
}

function isFocused(appId: string) {
  const wins = taskbarWindows.value.filter(w => w.appId === appId)
  if (!wins.length) return false
  const maxZ = Math.max(...taskbarWindows.value.map(w => w.zIndex))
  return wins.some(w => w.zIndex === maxZ && !w.minimized)
}

function handleTaskClick(appId: string) {
  const running = taskbarWindows.value.find(w => w.appId === appId)
  if (!running) {
    openApp(appId)
    return
  }
  if (running.minimized) {
    running.minimized = false
    focusWindow(running.id)
  } else if (isFocused(appId)) {
    minimizeWindow(running.id)
  } else {
    focusWindow(running.id)
  }
}

const now = ref(new Date())
onMounted(() => {
  const t = setInterval(() => now.value = new Date(), 1000)
  onUnmounted(() => clearInterval(t))
})

const time = computed(() =>
  now.value.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
)
const dateShort = computed(() =>
  now.value.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
)
</script>

<style scoped>
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--taskbar-height);
  background: var(--taskbar-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  gap: 2px;
  z-index: 8000;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.start-btn {
  width: 48px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  flex-shrink: 0;

  &:hover, &.active { background: rgba(255,255,255,0.1); }
}

.search-bar {
  height: 28px;
  width: 220px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  cursor: text;
  flex-shrink: 0;
  transition: background 0.15s;

  span {
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    white-space: nowrap;
    overflow: hidden;
  }

  &:hover { background: rgba(255,255,255,0.12); }
}

.taskview-btn {
  width: 36px;
  height: 100%;
  flex-shrink: 0;
}

.tasks {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 100%;
  padding: 0 4px;
}

.task-btn {
  position: relative;
  width: 44px;
  height: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.15s;
  gap: 2px;

  &:hover { background: rgba(255,255,255,0.1); }
  &.running { }
  &.focused { background: rgba(255,255,255,0.12); }
}

.task-icon { font-size: 18px; }

.task-indicator {
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 2px;
  background: var(--accent);
  border-radius: 1px;
}

.task-btn.focused .task-indicator {
  width: 20px;
  background: white;
}

.icon-btn {
  width: 32px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  border-radius: 2px;

  &:hover { background: rgba(255,255,255,0.1); }
}

.spacer { flex: 1; }

.tray {
  display: flex;
  align-items: center;
  height: 100%;
}

.tray-btn {
  width: 32px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.1); }
}

.clock-btn {
  height: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.1); }
}

.clock-time {
  font-size: 12px;
  color: white;
  font-weight: 400;
}

.clock-date {
  font-size: 11px;
  color: rgba(255,255,255,0.8);
}

.notif-btn {
  width: 36px;
}
</style>
