<template>
  <Transition name="start">
    <div
        v-if="open"
        aria-label="Menu Démarrer"
        aria-modal="true"
        class="start-menu"
        role="dialog"
        @click.stop
        @keydown.escape="emit('close')"
    >
      <!-- Left rail -->
      <nav aria-label="Raccourcis rapides" class="left-rail">
        <div class="left-rail-top">
          <button aria-label="Compte utilisateur : Utilisateur" class="rail-btn user-btn">
            <div aria-hidden="true" class="user-avatar" style="border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center;">
              <img v-if="ICON_START_USER.startsWith('/')" :src="ICON_START_USER" alt="" height="28" width="28"/>
              <Icon v-else :name="ICON_START_USER" aria-hidden="true" size="28"/>
            </div>
          </button>

          <button aria-label="Documents" class="rail-btn" @click="openAndClose('explorer')">
            <img v-if="ICON_START_DOCS.startsWith('/')" :src="ICON_START_DOCS" alt="" aria-hidden="true" height="20"
                 width="20"/>
            <Icon v-else :name="ICON_START_DOCS" aria-hidden="true" size="20"/>
          </button>

          <button aria-label="Images" class="rail-btn" @click="openAndClose('photos')">
            <img v-if="ICON_START_IMAGES.startsWith('/')" :src="ICON_START_IMAGES" alt="" aria-hidden="true" height="20"
                 width="20"/>
            <Icon v-else :name="ICON_START_IMAGES" aria-hidden="true" size="20"/>
          </button>

          <button aria-label="Paramètres" class="rail-btn" @click="openAndClose('settings')">
            <img v-if="ICON_START_SETTINGS.startsWith('/')" :src="ICON_START_SETTINGS" alt="" aria-hidden="true"
                 height="20"
                 width="20"/>
            <Icon v-else :name="ICON_START_SETTINGS" aria-hidden="true" size="20"/>
          </button>
        </div>

        <div class="left-rail-bottom">
          <button aria-label="Arrêter" class="rail-btn" @click="emit('shutdown')">
            <svg aria-hidden="true" fill="white" focusable="false" height="20" viewBox="0 0 24 24" width="20">
              <path
                  d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
            </svg>
          </button>
        </div>
      </nav>

      <!-- Main area -->
      <div class="main-area">
        <!-- All Apps List (Middle) -->
        <div class="all-apps">
          <div v-for="letter in letters" :key="letter" class="app-group">
            <div class="group-letter">{{ letter }}</div>
            <button
                v-for="app in appsByLetter[letter]"
                :key="app.id"
                class="list-app-btn"
                @click="openAndClose(app.id)"
            >
              <img v-if="app.icon.startsWith('/')" :src="app.icon" alt="" height="24" width="24"/>
              <Icon v-else :name="app.icon" size="24"/>
              <span>{{ app.name }}</span>
            </button>
          </div>
        </div>

        <!-- Tiles Area (Right) -->
        <div class="tiles-area">
          <div class="tiles-grid">
            <button
                v-for="app in APPS"
                :key="app.id"
                class="tile"
                @click="openAndClose(app.id)"
            >
              <img v-if="app.icon.startsWith('/')" :src="app.icon" alt="" height="32" width="32"/>
              <Icon v-else :name="app.icon" size="32"/>
              <span class="tile-label">{{ app.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {APPS} from '~/composables/useWindows'
import {
  ICON_APP_PDF,
  ICON_RECENT_FOLDER,
  ICON_RECENT_NOTEPAD,
  ICON_RECENT_PHOTOS,
  ICON_START_DOCS,
  ICON_START_IMAGES,
  ICON_START_SETTINGS,
  ICON_START_USER,
} from '~/composables/icons'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; shutdown: [] }>()

const {openApp} = useWindows()

function openAndClose(appId: string) {
  openApp(appId)
  emit('close')
}

const letters = computed(() => {
  const s = new Set<string>()
  APPS.forEach(a => s.add(a.name[0].toUpperCase()))
  return Array.from(s).sort()
})

const appsByLetter = computed(() => {
  const groups: Record<string, any[]> = {}
  APPS.forEach(app => {
    const l = app.name[0].toUpperCase()
    if (!groups[l]) groups[l] = []
    groups[l].push(app)
  })
  return groups
})
</script>

<style scoped>
.start-menu {
  position: fixed;
  bottom: var(--taskbar-height);
  left: 0;
  width: 720px;
  height: 600px;
  background: rgba(32, 32, 32, 0.98);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  display: flex;
  z-index: 7999;
  border-radius: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: none;
  border-bottom: none;
  overflow: hidden;
  box-shadow: 4px -4px 24px rgba(0, 0, 0, 0.5);
}

.left-rail {
  width: 48px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  flex-shrink: 0;
}

.rail-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  position: relative;
  transition: background 0.1s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.main-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.all-apps {
  width: 260px;
  overflow-y: auto;
  padding: 12px 0;
  border-right: 1px solid rgba(255, 255, 255, 0.05);

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
  }
}

.app-group {
  margin-bottom: 16px;
}

.group-letter {
  padding: 0 20px;
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 4px;
}

.list-app-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 20px;
  transition: background 0.1s;
  color: white;

  span {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.tiles-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.02);
}

.tiles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.tile {
  aspect-ratio: 1;
  background: var(--accent);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  transition: transform 0.1s, filter 0.1s;
  position: relative;

  &:hover {
    filter: brightness(1.1);
    transform: scale(0.98);
  }

  .tile-label {
    position: absolute;
    bottom: 6px;
    left: 8px;
    font-size: 11px;
    color: white;
    font-weight: 500;
    max-width: calc(100% - 16px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

/* Transitions */
.start-enter-active, .start-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.start-enter-from, .start-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
