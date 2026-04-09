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
        <Icon name="fluent:add-24-regular"/>
        Ajouter
      </button>
      <button class="tb-btn">
        <Icon name="fluent:settings-24-regular"/>
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
              :style="{ backgroundImage: `url(${photo.url}&w=400&h=400&fit=crop)` }"
              class="photo-tile"
              @click="selected = photo"
          >
            <div class="photo-overlay">
              <Icon class="overlay-icon" name="fluent:image-24-regular"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Transition name="fade">
      <div v-if="selected" class="lightbox" @click.self="selected = null">
        <div class="lightbox-content">
          <img :src="`${selected.url}&w=1200&h=800&fit=max`" alt="Photo"/>
        </div>
        <button class="lb-close" @click="selected = null">✕</button>
        <div class="lb-nav">
          <button @click.stop="prevPhoto">
            <Icon name="fluent:chevron-left-24-regular"/>
          </button>
          <button @click.stop="nextPhoto">
            <Icon name="fluent:chevron-right-24-regular"/>
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

const photoUrls = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format',
  'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format',
  'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format',
]

const photoGroups = [
  {
    date: 'Aujourd\'hui · 1 avril 2026',
    photos: Array.from({length: 4}, (_, i) => ({id: i, url: photoUrls[i]})),
  },
  {
    date: 'Hier · 31 mars 2026',
    photos: Array.from({length: 4}, (_, i) => ({id: i + 4, url: photoUrls[i + 4]})),
  },
  {
    date: 'Ce mois-ci · Mars 2026',
    photos: Array.from({length: 4}, (_, i) => ({id: i + 8, url: photoUrls[i + 8]})),
  },
]

const allPhotos = computed(() => photoGroups.flatMap(g => g.photos))

function prevPhoto() {
  const idx = allPhotos.value.findIndex(p => p.id === selected.value?.id)
  if (idx > 0) {
    selected.value = allPhotos.value[idx - 1]
  } else {
    selected.value = allPhotos.value[allPhotos.value.length - 1]
  }
}

function nextPhoto() {
  const idx = allPhotos.value.findIndex(p => p.id === selected.value?.id)
  if (idx < allPhotos.value.length - 1) {
    selected.value = allPhotos.value[idx + 1]
  } else {
    selected.value = allPhotos.value[0]
  }
}
</script>

<style lang="scss" scoped>
.photos {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1a1a1a;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
  background: transparent;
  border: none;
  border-radius: 3px;
  transition: all 0.15s;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }

  &.active {
    color: white;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 14px;
      right: 14px;
      height: 2px;
      background: #0078d4;
    }
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
  background: transparent;
  border: none;
  border-radius: 3px;
  transition: background 0.15s;
  cursor: pointer;

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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 4px;
}

.photo-tile {
  aspect-ratio: 1.5;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.01);

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
  background: rgba(0, 0, 0, 0.15);
  transition: opacity 0.15s;

  .overlay-icon {
    font-size: 24px;
    color: white;
    filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5));
  }
}

.lightbox {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.lightbox-content {
  max-width: 90%;
  max-height: 85%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  }
}

.lb-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.lb-nav {
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  pointer-events: none;

  button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
    cursor: pointer;
    pointer-events: auto;

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