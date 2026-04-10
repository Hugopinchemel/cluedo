<template>
  <Transition name="slide-up">
    <div
        v-if="open"
        aria-label="Paramètres rapides"
        class="quick-settings"
        role="region"
        @click.stop
    >
      <div aria-label="Actions rapides" class="qs-grid" role="group">
        <button
            v-for="qa in quickActions"
            :key="qa.label"
            :aria-label="`${qa.label} : ${qa.on ? 'activé' : 'désactivé'}`"
            :aria-pressed="qa.on"
            :class="{ on: qa.on }"
            class="qa-btn"
            @click="qa.on = !qa.on"
        >
          <div aria-hidden="true" class="qa-icon-wrapper">
            <img v-if="qa.icon.startsWith('/')" :src="qa.icon" alt="" aria-hidden="true" height="20" width="20"/>
            <Icon v-else :name="qa.icon" aria-hidden="true" size="20"/>
          </div>
          <span aria-hidden="true" class="qa-label">{{ qa.label }}</span>
        </button>
      </div>

      <div class="qs-sliders">
        <div class="qs-slider-row">
          <label class="sr-only" for="qs-brightness">Luminosité</label>
          <img v-if="ICON_QS_BRIGHTNESS.startsWith('/')" :src="ICON_QS_BRIGHTNESS" alt="" aria-hidden="true"
               class="qs-slider-icon"
               height="16" width="16"/>
          <Icon v-else :name="ICON_QS_BRIGHTNESS" aria-hidden="true" class="qs-slider-icon" size="16"/>
          <input
              id="qs-brightness"
              :aria-label="`Luminosité : ${settings.brightness}%`"
              :value="settings.brightness"
              class="qs-range" max="100"
              min="0"
              type="range"
              @input="e => updateSettings({ brightness: parseInt((e.target as HTMLInputElement).value) })"
          >
        </div>
        <div class="qs-slider-row">
          <label class="sr-only" for="qs-volume">Volume</label>
          <img v-if="ICON_QS_VOLUME.startsWith('/')" :src="ICON_QS_VOLUME" alt="" aria-hidden="true"
               class="qs-slider-icon" height="16"
               width="16"/>
          <Icon v-else :name="ICON_QS_VOLUME" aria-hidden="true" class="qs-slider-icon" size="16"/>
          <input
              id="qs-volume"
              :aria-label="`Volume : ${settings.volume}%`"
              :value="settings.volume"
              class="qs-range" max="100"
              min="0"
              type="range"
              @input="e => updateSettings({ volume: parseInt((e.target as HTMLInputElement).value) })"
          >
        </div>
      </div>

      <div class="qs-footer">
        <div aria-label="Batterie : 100%" class="qs-battery">
          <img v-if="ICON_TRAY_BATTERY.startsWith('/')" :src="ICON_TRAY_BATTERY" alt="" aria-hidden="true"
               class="qs-battery-icon"
               height="16" width="16"/>
          <Icon v-else :name="ICON_TRAY_BATTERY" aria-hidden="true" class="qs-battery-icon" size="16"/>
          <span aria-hidden="true">100%</span>
        </div>
        <div class="qs-footer-right">
          <button aria-label="Ouvrir les paramètres" class="qs-settings-btn" @click="$emit('openSettings')">
            <img v-if="ICON_APP_SETTINGS.startsWith('/')" :src="ICON_APP_SETTINGS" alt="" aria-hidden="true" height="16"
                 width="16"/>
            <Icon v-else :name="ICON_APP_SETTINGS" aria-hidden="true" size="16"/>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import {
  ICON_APP_SETTINGS,
  ICON_QS_AIRPLANE,
  ICON_QS_BATTERY,
  ICON_QS_BLUETOOTH,
  ICON_QS_BRIGHTNESS,
  ICON_QS_DND,
  ICON_QS_VOLUME,
  ICON_QS_WIFI,
  ICON_TRAY_BATTERY,
} from '~/composables/icons'

defineProps<{ open: boolean }>()
defineEmits(['openSettings'])

const {settings, updateSettings} = useSettings()

const quickActions = ref([
  {icon: ICON_QS_WIFI, label: 'Wi-Fi', on: true},
  {icon: ICON_QS_BLUETOOTH, label: 'Bluetooth', on: true},
  {icon: ICON_QS_AIRPLANE, label: 'Mode avion', on: false},
  {icon: ICON_QS_DND, label: 'Ne pas déranger', on: false},
  {icon: ICON_QS_BATTERY, label: 'Économiseur', on: false},
])

</script>

<style scoped>
.quick-settings {
  position: fixed;
  right: 12px;
  bottom: calc(var(--taskbar-height) + 12px);
  width: 360px;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0;
  padding: 24px;
  z-index: 7000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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
  border-radius: 0;
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

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.25s cubic-bezier(0.1, 0.9, 0.2, 1);
}

.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
