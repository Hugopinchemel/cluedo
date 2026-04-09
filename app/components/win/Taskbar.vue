<template>
  <div class="taskbar">
    <!-- Start button -->
    <button :class="{ active: startOpen }" class="start-btn" @click="$emit('toggleStart')">
      <img :src="ICON_TASKBAR_START" alt="Start" height="18" width="18"/>
    </button>

    <!-- Search -->
    <div class="search-bar" @click="$emit('openApp', 'edge')">
      <img :src="ICON_TASKBAR_SEARCH" alt="Search" height="14" style="opacity: 0.6" width="14"/>
      <span>Rechercher dans Windows</span>
    </div>

    <!-- Task view button -->
    <button class="icon-btn taskview-btn" title="Vue des tâches">
      <img :src="ICON_TASKBAR_TASKVIEW" alt="Task View" height="16" width="16"/>
    </button>

    <!-- Pinned + Running apps -->
    <div class="tasks">
      <!-- Pinned apps -->
      <button
          v-for="app in APPS"
          :key="app.id"
          :class="{ active: isFocused(app.id), running: isRunning(app.id) }"
          :title="app.name"
          class="task-btn"
          @click="handleTaskClick(app.id)"
      >
        <img v-if="app.icon.startsWith('/')" :src="app.icon" alt="" class="task-icon-img" height="18" width="18"/>
        <Icon v-else :name="app.icon" class="task-icon"/>
        <span v-if="isRunning(app.id)" class="task-indicator"/>
      </button>
    </div>

    <div class="spacer"/>

    <!-- System tray -->
    <div class="tray">
      <!-- Network -->
      <button :class="{ active: qsOpen }" class="tray-btn" title="Réseau" @click="$emit('toggleQuickSettings')">
        <img v-if="ICON_TRAY_NETWORK.startsWith('/')" :src="ICON_TRAY_NETWORK" alt="Network" height="16"
             style="opacity: 0.85" width="16"/>
        <Icon v-else :name="ICON_TRAY_NETWORK" size="16" style="opacity: 0.85"/>
      </button>
      <!-- Sound -->
      <button :class="{ active: qsOpen }" class="tray-btn" title="Volume" @click="$emit('toggleQuickSettings')">
        <img v-if="ICON_TRAY_VOLUME.startsWith('/')" :src="ICON_TRAY_VOLUME" alt="Volume" height="16"
             style="opacity: 0.85" width="16"/>
        <Icon v-else :name="ICON_TRAY_VOLUME" size="16" style="opacity: 0.85"/>
      </button>
      <!-- Battery -->
      <button :class="{ active: qsOpen }" class="tray-btn" title="Batterie" @click="$emit('toggleQuickSettings')">
        <img v-if="ICON_TRAY_BATTERY.startsWith('/')" :src="ICON_TRAY_BATTERY" alt="Battery" height="16"
             style="opacity: 0.85" width="16"/>
        <Icon v-else :name="ICON_TRAY_BATTERY" size="16" style="opacity: 0.85"/>
      </button>

      <!-- Clock -->
      <button :class="{ active: notifOpen }" class="clock-btn" @click="$emit('toggleCalendar')">
        <div class="clock-time">{{ time }}</div>
        <div class="clock-date">{{ dateShort }}</div>
      </button>

      <!-- Notification center -->
      <button :class="{ active: notifOpen }" class="icon-btn notif-btn" title="Centre de notifications"
              @click="$emit('toggleNotif')">
        <img v-if="ICON_TRAY_NOTIFICATIONS.startsWith('/')" :src="ICON_TRAY_NOTIFICATIONS" alt="Notifications" height="16"
             style="opacity: 0.85" width="16"/>
        <Icon v-else :name="ICON_TRAY_NOTIFICATIONS" size="16" style="opacity: 0.85"/>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {APPS} from '~/composables/useWindows'
import {
  ICON_TASKBAR_SEARCH,
  ICON_TASKBAR_START,
  ICON_TASKBAR_TASKVIEW,
  ICON_TRAY_BATTERY,
  ICON_TRAY_NETWORK,
  ICON_TRAY_NOTIFICATIONS,
  ICON_TRAY_VOLUME,
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

const {taskbarWindows, openApp, focusWindow, minimizeWindow} = useWindows()

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
    now.value.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})
)
const dateShort = computed(() =>
    now.value.toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})
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
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.start-btn {
  width: 48px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  flex-shrink: 0;

  &:hover, &.active {
    background: rgba(255, 255, 255, 0.1);
  }
}

.search-bar {
  height: 28px;
  width: 220px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
    color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
    overflow: hidden;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
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

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.running {
  }

  &.focused {
    background: rgba(255, 255, 255, 0.12);
  }
}

.task-icon {
  font-size: 18px;
}

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

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.spacer {
  flex: 1;
}

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

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
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

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.clock-time {
  font-size: 12px;
  color: white;
  font-weight: 400;
}

.clock-date {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
}

.notif-btn {
  width: 36px;
  filter: invert(1);
}
</style>
