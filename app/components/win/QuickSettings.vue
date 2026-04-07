<template>
  <Transition name="slide-up">
    <div v-if="open" class="quick-settings" @click.stop>
      <div class="qs-grid">
        <button
          v-for="qa in quickActions"
          :key="qa.label"
          class="qa-btn"
          :class="{ on: qa.on }"
          @click="qa.on = !qa.on"
        >
          <div class="qa-icon-wrapper">
            <img :src="qa.icon" width="20" height="20" style="filter: invert(1)" alt="" />
          </div>
          <span class="qa-label">{{ qa.label }}</span>
        </button>
      </div>

      <div class="qs-sliders">
        <div class="qs-slider-row">
          <img :src="ICON_QS_BRIGHTNESS" width="16" height="16" class="qs-slider-icon" style="filter: invert(1)" alt="" />
          <input type="range" v-model="brightness" min="0" max="100" class="qs-range">
        </div>
        <div class="qs-slider-row">
          <img :src="ICON_QS_VOLUME" width="16" height="16" class="qs-slider-icon" style="filter: invert(1)" alt="" />
          <input type="range" v-model="volume" min="0" max="100" class="qs-range">
        </div>
      </div>

      <div class="qs-footer">
        <div class="qs-battery">
          <img :src="ICON_TRAY_BATTERY" width="16" height="16" class="qs-battery-icon" style="filter: invert(1)" alt="" />
          <span>100%</span>
        </div>
        <div class="qs-footer-right">
          <button class="qs-settings-btn" @click="$emit('openSettings')">
            <img :src="ICON_APP_SETTINGS" width="16" height="16" style="filter: invert(1)" alt="" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  ICON_QS_WIFI,
  ICON_QS_BLUETOOTH,
  ICON_QS_AIRPLANE,
  ICON_QS_DND,
  ICON_QS_FLASHLIGHT,
  ICON_QS_BATTERY,
  ICON_QS_BRIGHTNESS,
  ICON_QS_VOLUME,
  ICON_TRAY_BATTERY,
  ICON_APP_SETTINGS,
} from '~/composables/icons'

defineProps<{ open: boolean }>()
defineEmits(['openSettings'])

const brightness = ref(80)
const volume = ref(50)

const quickActions = ref([
  { icon: ICON_QS_WIFI, label: 'Wi-Fi', on: true },
  { icon: ICON_QS_BLUETOOTH, label: 'Bluetooth', on: true },
  { icon: ICON_QS_AIRPLANE, label: 'Mode avion', on: false },
  { icon: ICON_QS_DND, label: 'Ne pas déranger', on: false },
  { icon: ICON_QS_FLASHLIGHT, label: 'Lampe torche', on: false },
  { icon: ICON_QS_BATTERY, label: 'Économiseur', on: false },
])

</script>

<style scoped>
.quick-settings {
  position: fixed;
  right: 12px;
  bottom: calc(var(--taskbar-height) + 12px);
  width: 360px;
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  z-index: 7000;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.qs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.qa-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.qa-icon-wrapper {
  width: 100%;
  aspect-ratio: 1.8;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 20px;
}

.qa-btn:hover .qa-icon-wrapper {
  background: rgba(255, 255, 255, 0.1);
}

.qa-btn.on .qa-icon-wrapper {
  background: var(--accent);
}

.qa-label {
  font-size: 11px;
  color: white;
}

.qs-sliders {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.qs-slider-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qs-slider-icon {
  font-size: 16px;
  width: 20px;
}

.qs-range {
  flex: 1;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  height: 4px;
  border-radius: 2px;
  outline: none;
}

.qs-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: white;
  border: 4px solid var(--accent);
  border-radius: 50%;
  cursor: pointer;
}

.qs-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.qs-battery {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: white;
}

.qs-settings-btn {
  padding: 6px;
  border-radius: 4px;
  &:hover { background: rgba(255, 255, 255, 0.1); }
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.25s cubic-bezier(0.1, 0.9, 0.2, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
