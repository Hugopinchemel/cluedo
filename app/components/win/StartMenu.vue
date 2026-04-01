<template>
  <Transition name="start">
    <div v-if="open" class="start-menu" @click.stop>
      <!-- Left rail -->
      <div class="left-rail">
        <button class="rail-btn user-btn" title="Compte">
          <div class="user-avatar">
            <img :src="ICON_START_USER" width="22" height="22" style="filter: invert(1)" alt="User" />
          </div>
          <span class="rail-label">Utilisateur</span>
        </button>

        <button class="rail-btn" title="Documents" @click="openAndClose('explorer')">
          <img :src="ICON_START_DOCS" width="20" height="20" style="filter: invert(1)" alt="Documents" />
          <span class="rail-label">Documents</span>
        </button>

        <button class="rail-btn" title="Images" @click="openAndClose('photos')">
          <img :src="ICON_START_IMAGES" width="20" height="20" style="filter: invert(1)" alt="Images" />
          <span class="rail-label">Images</span>
        </button>

        <button class="rail-btn" title="Paramètres" @click="openAndClose('settings')">
          <img :src="ICON_START_SETTINGS" width="20" height="20" alt="Settings" />
          <span class="rail-label">Paramètres</span>
        </button>

        <button class="rail-btn power-btn" title="Alimentation">
          <img :src="ICON_START_POWER" width="20" height="20" style="filter: invert(1)" alt="Power" />
          <span class="rail-label">Arrêter</span>
        </button>
      </div>

      <!-- Main area -->
      <div class="main-area">
        <!-- Épinglées -->
        <div class="section-title">Épinglées</div>
        <div class="app-grid">
          <button
            v-for="app in APPS"
            :key="app.id"
            class="app-tile"
            @click="openAndClose(app.id)"
          >
            <img v-if="app.icon.startsWith('/')" :src="app.icon" width="24" height="24" class="tile-icon-img" alt="" />
            <Icon v-else :name="app.icon" class="tile-icon" />
            <span class="tile-name">{{ app.name }}</span>
          </button>
        </div>

        <!-- Récentes -->
        <div class="section-title">Recommandées</div>
        <div class="recent-list">
          <button class="recent-item" v-for="item in recentItems" :key="item.name">
            <img v-if="item.icon.startsWith('/')" :src="item.icon" width="20" height="20" class="recent-icon-img" alt="" />
            <Icon v-else :name="item.icon" class="recent-icon" />
            <div class="recent-info">
              <div class="recent-name">{{ item.name }}</div>
              <div class="recent-meta">{{ item.meta }}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { APPS } from '~/composables/useWindows'
import {
  ICON_START_USER,
  ICON_START_DOCS,
  ICON_START_IMAGES,
  ICON_START_SETTINGS,
  ICON_START_POWER,
  ICON_RECENT_NOTEPAD,
  ICON_RECENT_FOLDER,
  ICON_RECENT_PHOTOS,
  ICON_RECENT_SETTINGS,
} from '~/composables/icons'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { openApp } = useWindows()

function openAndClose(appId: string) {
  openApp(appId)
  emit('close')
}

const recentItems = [
  { icon: ICON_RECENT_NOTEPAD,  name: 'Notes.txt',        meta: 'Bloc-notes · Il y a 2 min' },
  { icon: ICON_RECENT_FOLDER,   name: 'Documents',        meta: 'Explorateur · Hier' },
  { icon: ICON_RECENT_PHOTOS,   name: 'Fond d\'écran.png', meta: 'Photos · Il y a 3 jours' },
  { icon: ICON_RECENT_SETTINGS, name: 'Paramètres',       meta: 'Paramètres · Il y a 1 semaine' },
]
</script>

<style scoped>
.start-menu {
  position: fixed;
  bottom: var(--taskbar-height);
  left: 0;
  width: 640px;
  height: 580px;
  background: rgba(32, 32, 32, 0.96);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  display: flex;
  z-index: 7999;
  border-radius: 0 8px 0 0;
  border: 1px solid rgba(255,255,255,0.08);
  border-left: none;
  border-bottom: none;
  overflow: hidden;
  box-shadow: 4px -4px 24px rgba(0,0,0,0.5);
}

.left-rail {
  width: 52px;
  background: rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  gap: 2px;
  flex-shrink: 0;
}

.rail-btn {
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  gap: 2px;
  position: relative;
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.1); }

  .rail-label {
    display: none;
    position: absolute;
    left: 56px;
    background: rgba(50,50,50,0.95);
    color: white;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 1;
  }

  &:hover .rail-label { display: block; }
}

.user-btn { margin-top: auto; order: 1; }
.power-btn { margin-top: auto; }

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-area {
  flex: 1;
  padding: 24px 20px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  margin-bottom: 4px;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
}

.app-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 6px 10px;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.1); }
}

.tile-icon { font-size: 24px; }

.tile-name {
  font-size: 11px;
  color: rgba(255,255,255,0.85);
  text-align: center;
  line-height: 1.3;
  max-width: 72px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.08); }
}

.recent-icon { font-size: 20px; flex-shrink: 0; }

.recent-name {
  font-size: 13px;
  color: rgba(255,255,255,0.9);
}

.recent-meta {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  margin-top: 1px;
}

/* Transitions */
.start-enter-active, .start-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.start-enter-from, .start-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
