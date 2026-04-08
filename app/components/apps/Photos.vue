<template>
  <div class="photos">
    <!-- Toolbar -->
    <div class="toolbar">
      <button
          v-for="tab in tabs"
          :key="tab"
          :class="{ active: activeTab === tab }"
          class="tab-btn"
          @click="activeTab = tab"
      >{{ tab }}
      </button>
      <div class="tb-spacer"/>
      <button class="tb-btn">
        <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
          <path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        Ajouter
      </button>
      <button class="tb-btn">
        <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
          <path
              d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
        </svg>
      </button>
    </div>

    <!-- Gallery -->
    <div class="gallery">
      <div v-for="(group, i) in photoGroups" :key="i" class="photo-group">
        <div class="group-date">{{ group.date }}</div>
        <div class="photo-grid">
          <div
              v-for="(photo, j) in group.photos"
              :key="j"
              :style="{ background: photo.color }"
              class="photo-tile"
              @click="selected = photo"
          >
            <div class="photo-overlay">
              <svg fill="rgba(255,255,255,0.7)" height="24" viewBox="0 0 24 24" width="24">
                <path
                    d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Transition name="fade">
      <div v-if="selected" class="lightbox" @click.self="selected = null">
        <div :style="{ background: selected.color }" class="lightbox-content">
          <svg fill="rgba(255,255,255,0.5)" height="80" viewBox="0 0 24 24" width="80">
            <path
                d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </div>
        <button class="lb-close" @click="selected = null">✕</button>
        <div class="lb-nav">
          <button>
            <svg fill="white" height="24" viewBox="0 0 24 24" width="24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button>
            <svg fill="white" height="24" viewBox="0 0 24 24" width="24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
const tabs = ['Collection', 'Albums', 'Personnes', 'Dossiers', 'Vidéo']
const activeTab = ref('Collection')
const selected = ref<any>(null)

const colors = [
  '#2c5f8a', '#8a2c5f', '#5f8a2c', '#8a5f2c',
  '#2c8a5f', '#5f2c8a', '#8a8a2c', '#2c8a8a',
  '#6a4c93', '#1982c4', '#8ac926', '#ff595e',
  '#ffca3a', '#6a4c93', '#52b788', '#e63946',
]

const photoGroups = [
  {
    date: 'Aujourd\'hui · 1 avril 2026',
    photos: Array.from({length: 4}, (_, i) => ({color: colors[i]})),
  },
  {
    date: 'Hier · 31 mars 2026',
    photos: Array.from({length: 6}, (_, i) => ({color: colors[i + 4]})),
  },
  {
    date: 'Ce mois-ci · Mars 2026',
    photos: Array.from({length: 8}, (_, i) => ({color: colors[i % colors.length]})),
  },
]
</script>

<style scoped>
.photos {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1a1a1a;
  color: white;
}

.toolbar {
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #252525;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  height: 44px;
  gap: 4px;
}

.tab-btn {
  padding: 6px 14px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 3px;
  transition: all 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }

  &.active {
    color: white;
    border-bottom: 2px solid white;
    border-radius: 0;
  }
}

.tb-spacer {
  flex: 1;
}

.tb-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.gallery {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.group-date {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 4px;
}

.photo-tile {
  aspect-ratio: 1;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.15s;

  &:hover {
    transform: scale(1.02);

    .photo-overlay {
      opacity: 1;
    }
  }
}

.photo-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s;
}

.lightbox {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.lightbox-content {
  width: 70%;
  height: 70%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.lb-nav {
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;

  button {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
