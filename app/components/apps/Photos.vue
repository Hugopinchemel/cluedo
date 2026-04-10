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
              :style="{ backgroundImage: `url(${photo.url})` }"
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
          <img :src="selected.url" alt="Photo"/>
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
  '/picture/img/1CA54070-43EC-4933-A9BE-CE04E2D31157.jpg',
  '/picture/img/2528495E-005E-4A10-BA06-D698E57A2301.jpg',
  '/picture/img/404E6095-706A-48AB-8850-0D559B4D00A7.jpg',
  '/picture/img/44AEFE4A-689B-4E05-B4B0-6DAF8006FA99.jpg',
  '/picture/img/50D8E143-9E28-448C-A0B4-11CC5CD007E0_4_5005_c.jpeg',
  '/picture/img/925ADEB4-037C-47F3-BC8E-F2D48FEF17B8.jpg',
  '/picture/img/95E64136-A643-4B01-8CA8-06DED143E648.jpg',
  '/picture/img/BD5EC050-9BEA-4563-83CA-65EA1DC7F402_4_5005_c.jpeg',
  '/picture/img/CE52A319-5B8F-4BDA-BB2B-CA6CA1DE8329.jpg',
  '/picture/img/EC7BCC0F-2DC4-450D-869D-DE6B6ABA5450.jpg',
  '/picture/img/F097F4B9-722F-4DA7-9A5B-E15A02650B3B.jpg',
]

const photoGroups = [
  {
    date: 'L\'année dernière · 23 Août 2025',
    photos: Array.from({length: 4}, (_, i) => ({id: i, url: photoUrls[i]})),
  },
  {
    date: 'L\'année dernière · 19 Août 2025',
    photos: Array.from({length: 4}, (_, i) => ({id: i + 4, url: photoUrls[i + 4]})),
  },
  {
    date: 'L\'année dernière · 16 Août 2025',
    photos: Array.from({length: 3}, (_, i) => ({id: i + 8, url: photoUrls[i + 8]})),
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