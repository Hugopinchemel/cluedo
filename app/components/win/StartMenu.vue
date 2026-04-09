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
        <button aria-label="Compte utilisateur : Utilisateur" class="rail-btn user-btn">
          <div aria-hidden="true" class="user-avatar">
            <img v-if="ICON_START_USER.startsWith('/')" :src="ICON_START_USER" alt="" height="28" width="28"/>
            <Icon v-else :name="ICON_START_USER" aria-hidden="true" size="28"/>
          </div>
          <span aria-hidden="true" class="rail-label">Utilisateur</span>
        </button>

        <button aria-label="Documents" class="rail-btn" @click="openAndClose('explorer')">
          <img v-if="ICON_START_DOCS.startsWith('/')" :src="ICON_START_DOCS" alt="" aria-hidden="true" height="20"
               width="20"/>
          <Icon v-else :name="ICON_START_DOCS" aria-hidden="true" size="20"/>
          <span aria-hidden="true" class="rail-label">Documents</span>
        </button>

        <button aria-label="Images" class="rail-btn" @click="openAndClose('photos')">
          <img v-if="ICON_START_IMAGES.startsWith('/')" :src="ICON_START_IMAGES" alt="" aria-hidden="true" height="20"
               width="20"/>
          <Icon v-else :name="ICON_START_IMAGES" aria-hidden="true" size="20"/>
          <span aria-hidden="true" class="rail-label">Images</span>
        </button>

        <button aria-label="Paramètres" class="rail-btn" @click="openAndClose('settings')">
          <img v-if="ICON_START_SETTINGS.startsWith('/')" :src="ICON_START_SETTINGS" alt="" aria-hidden="true"
               height="20"
               width="20"/>
          <Icon v-else :name="ICON_START_SETTINGS" aria-hidden="true" size="20"/>
          <span aria-hidden="true" class="rail-label">Paramètres</span>
        </button>

        <button aria-label="Arrêter" class="rail-btn" @click="emit('shutdown')">
          <svg aria-hidden="true" fill="white" focusable="false" height="20" viewBox="0 0 24 24" width="20">
            <path
                d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
          </svg>
          <span aria-hidden="true" class="rail-label">Arrêter</span>
        </button>
      </nav>

      <!-- Main area -->
      <div class="main-area">
        <!-- Épinglées -->
        <h2 class="section-title">Épinglées</h2>
        <ul class="app-grid" role="list">
          <li v-for="app in APPS" :key="app.id">
            <button
                :aria-label="app.name"
                class="app-tile"
                @click="openAndClose(app.id)"
            >
              <img v-if="app.icon.startsWith('/')" :src="app.icon" alt="" aria-hidden="true" class="tile-icon-img"
                   height="24" width="24"/>
              <Icon v-else :name="app.icon" aria-hidden="true" class="tile-icon"/>
              <span aria-hidden="true" class="tile-name">{{ app.name }}</span>
            </button>
          </li>
        </ul>

        <!-- Recommandées -->
        <h2 class="section-title">Recommandées</h2>
        <ul class="recent-list" role="list">
          <li v-for="item in recentItems" :key="item.name">
            <button :aria-label="`${item.name} – ${item.meta}`" class="recent-item">
              <img v-if="item.icon.startsWith('/')" :src="item.icon" alt="" aria-hidden="true" class="recent-icon-img"
                   height="20"
                   width="20"/>
              <Icon v-else :name="item.icon" aria-hidden="true" class="recent-icon"/>
              <div aria-hidden="true" class="recent-info">
                <div class="recent-name">{{ item.name }}</div>
                <div class="recent-meta">{{ item.meta }}</div>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
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

const recentItems = [
  {icon: ICON_APP_PDF, name: 'sample.pdf', meta: 'Lecteur PDF · Il y a 1 min'},
  {icon: ICON_RECENT_NOTEPAD, name: 'Notes.txt', meta: 'Bloc-notes · Il y a 2 min'},
  {icon: ICON_RECENT_FOLDER, name: 'Documents', meta: 'Explorateur · Hier'},
  {icon: ICON_RECENT_PHOTOS, name: 'Fond d\'écran.png', meta: 'Photos · Il y a 3 jours'},
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
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: none;
  border-bottom: none;
  overflow: hidden;
  box-shadow: 4px -4px 24px rgba(0, 0, 0, 0.5);
}

.left-rail {
  width: 52px;
  background: rgba(0, 0, 0, 0.3);
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

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .rail-label {
    display: none;
    position: absolute;
    left: 56px;
    background: rgba(50, 50, 50, 0.95);
    color: white;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 1;
  }

  &:hover .rail-label {
    display: block;
  }
}

.user-btn {
  margin-top: auto;
  order: 1;
}

.power-btn {
  margin-top: auto;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 50%;
  }
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
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
  /* Réinitialiser les styles de titre natifs */
  font-family: inherit;
  line-height: inherit;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.app-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 6px 10px;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.tile-icon {
  font-size: 24px;
}

.tile-name {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
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
  list-style: none;
  padding: 0;
  margin: 0;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}

.recent-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.recent-name {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
}

.recent-meta {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
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
