<template>
  <Transition name="slide-right">
    <div v-if="open" class="notif-center" @click.stop>
      <!-- Notifications Section -->
      <div class="notif-section">
        <div class="notif-header">
          <span>Notifications</span>
          <button v-if="notifications.length" @click="notifications = []">Effacer tout</button>
        </div>
        
        <div v-if="!notifications.length" class="notif-empty">
          <Icon :name="ICON_FLUENT_ALERT_OFF" size="48" style="color: rgba(255,255,255,0.2)" />
          <p>Pas de nouvelles notifications</p>
        </div>

        <div class="notif-list">
          <div v-for="(n, i) in notifications" :key="i" class="notif-item">
            <div class="notif-app-header">
              <Icon :name="n.icon || ICON_FLUENT_ALERT" class="notif-app-icon" />
              <span class="notif-app-name">{{ n.app }}</span>
              <button class="notif-close" @click="removeNotif(i)">✕</button>
            </div>
            <div class="notif-content">
              <div class="notif-title">{{ n.title }}</div>
              <div class="notif-msg">{{ n.message }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar Section -->
      <div class="calendar-section">
        <div class="cal-header">
          <span class="cal-month">{{ currentMonth }}</span>
          <div class="cal-controls">
            <button><Icon :name="ICON_FLUENT_CHEVRON_UP" size="14" /></button>
            <button><Icon :name="ICON_FLUENT_CHEVRON_DOWN" size="14" /></button>
          </div>
        </div>
        <div class="cal-grid">
          <div v-for="d in ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']" :key="d" class="cal-day-label">{{ d }}</div>
          <div v-for="n in 31" :key="n" class="cal-day" :class="{ today: n === today }">{{ n }}</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  ICON_FLUENT_ALERT,
  ICON_FLUENT_ALERT_OFF,
  ICON_FLUENT_CHEVRON_UP,
  ICON_FLUENT_CHEVRON_DOWN,
  ICON_FLUENT_UPDATE,
  ICON_FLUENT_SECURITY,
} from '~/composables/icons'

defineProps<{ open: boolean }>()

const notifications = ref([
  { app: 'Windows Update', title: 'Mise à jour prête', message: 'Une mise à jour importante est prête à être installée.', icon: ICON_FLUENT_UPDATE },
  { app: 'Sécurité Windows', title: 'Analyse terminée', message: 'Aucune menace n\'a été détectée lors de la dernière analyse.', icon: ICON_FLUENT_SECURITY },
])


function removeNotif(index: number) {
  notifications.value.splice(index, 1)
}

const now = new Date()
const today = now.getDate()
const currentMonth = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
</script>

<style scoped>
.notif-center {
  position: fixed;
  right: 12px;
  top: 12px;
  bottom: calc(var(--taskbar-height) + 12px);
  width: 360px;
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  z-index: 7500;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.notif-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: white;

  button {
    font-size: 12px;
    color: var(--accent);
    background: rgba(255,255,255,0.05);
    padding: 4px 8px;
    border-radius: 4px;
    &:hover { background: rgba(255,255,255,0.1); }
  }
}

.notif-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255,255,255,0.3);
  font-size: 13px;
}

.notif-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.notif-item {
  padding: 12px;
  background: rgba(255,255,255,0.06);
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.05);
}

.notif-app-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.notif-app-icon { font-size: 14px; }
.notif-app-name { font-size: 11px; color: rgba(255,255,255,0.5); flex: 1; }
.notif-close { color: rgba(255,255,255,0.4); font-size: 10px; }

.notif-title { font-size: 13px; font-weight: 600; color: white; margin-bottom: 2px; }
.notif-msg { font-size: 12px; color: rgba(255,255,255,0.8); line-height: 1.4; }

.calendar-section {
  padding: 20px;
  background: rgba(255,255,255,0.03);
  border-top: 1px solid rgba(255,255,255,0.08);
}

.cal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.cal-month { font-size: 14px; font-weight: 600; color: white; text-transform: capitalize; }
.cal-controls { display: flex; gap: 4px; }
.cal-controls button { padding: 4px 8px; border-radius: 4px; &:hover { background: rgba(255,255,255,0.1); } }

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  text-align: center;
}

.cal-day-label { font-size: 11px; color: rgba(255,255,255,0.5); padding: 8px 0; }
.cal-day {
  font-size: 12px;
  padding: 8px 0;
  color: rgba(255,255,255,0.9);
  border-radius: 50%;
  cursor: default;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover { background: rgba(255,255,255,0.1); }
  &.today { background: var(--accent); color: white; font-weight: 600; }
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: all 0.25s cubic-bezier(0.1, 0.9, 0.2, 1);
}
.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
