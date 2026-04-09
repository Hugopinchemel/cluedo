<template>
  <Transition name="slide-right">
    <div
        v-if="open"
        aria-label="Centre de notifications"
        class="notif-center"
        role="region"
        @click.stop
    >
      <!-- Notifications Section -->
      <section aria-label="Notifications" class="notif-section">
        <div class="notif-header">
          <h2 class="notif-heading">Notifications</h2>
          <button
              v-if="notifications.length"
              aria-label="Effacer toutes les notifications"
              @click="notifications = []"
          >Effacer tout
          </button>
        </div>

        <div v-if="!notifications.length" aria-live="polite" class="notif-empty">
          <Icon :name="ICON_FLUENT_ALERT_OFF" aria-hidden="true" size="48" style="color: rgba(255,255,255,0.2)"/>
          <p>Pas de nouvelles notifications</p>
        </div>

        <ul aria-live="polite" aria-relevant="additions removals" class="notif-list">
          <li v-for="(n, i) in notifications" :key="i" class="notif-item" role="article">
            <div class="notif-app-header">
              <Icon :name="n.icon || ICON_FLUENT_ALERT" aria-hidden="true" class="notif-app-icon"/>
              <span class="notif-app-name">{{ n.app }}</span>
              <button
                  :aria-label="`Fermer la notification de ${n.app} : ${n.title}`"
                  class="notif-close"
                  @click="removeNotif(i)"
              >✕
              </button>
            </div>
            <div class="notif-content">
              <h3 class="notif-title">{{ n.title }}</h3>
              <p class="notif-msg">{{ n.message }}</p>
            </div>
          </li>
        </ul>
      </section>

      <!-- Calendar Section -->
      <section aria-label="Calendrier" class="calendar-section">
        <div class="cal-header">
          <h2 class="cal-month">{{ currentMonth }}</h2>
          <div :aria-label="`Navigation du mois : ${currentMonth}`" class="cal-controls" role="group">
            <button aria-label="Mois précédent">
              <Icon :name="ICON_FLUENT_CHEVRON_UP" aria-hidden="true" size="14"/>
            </button>
            <button aria-label="Mois suivant">
              <Icon :name="ICON_FLUENT_CHEVRON_DOWN" aria-hidden="true" size="14"/>
            </button>
          </div>
        </div>
        <div :aria-label="`Calendrier – ${currentMonth}`" class="cal-grid" role="grid">
          <div
              v-for="d in ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']"
              :key="d"
              :aria-label="d"
              class="cal-day-label"
              role="columnheader"
          >{{ d.slice(0, 2) }}
          </div>
          <div
              v-for="n in 31"
              :key="n"
              :aria-current="n === today ? 'date' : undefined"
              :aria-label="n === today ? `${n} – aujourd'hui` : String(n)"
              :class="{ today: n === today }"
              class="cal-day"
              role="gridcell"
          >{{ n }}
          </div>
        </div>
      </section>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import {
  ICON_FLUENT_ALERT,
  ICON_FLUENT_ALERT_OFF,
  ICON_FLUENT_CHEVRON_DOWN,
  ICON_FLUENT_CHEVRON_UP,
  ICON_FLUENT_SECURITY,
  ICON_FLUENT_UPDATE,
} from '~/composables/icons'

defineProps<{ open: boolean }>()

const notifications = ref([
  {
    app: 'Windows Update',
    title: 'Mise à jour prête',
    message: 'Une mise à jour importante est prête à être installée.',
    icon: ICON_FLUENT_UPDATE
  },
  {
    app: 'Sécurité Windows',
    title: 'Analyse terminée',
    message: 'Aucune menace n\'a été détectée lors de la dernière analyse.',
    icon: ICON_FLUENT_SECURITY
  },
])


function removeNotif(index: number) {
  notifications.value.splice(index, 1)
}

const now = new Date()
const today = now.getDate()
const currentMonth = now.toLocaleDateString('fr-FR', {month: 'long', year: 'numeric'})
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.notif-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

.notif-heading {
  font-size: 14px;
  font-weight: 600;
  color: white;
  font-family: inherit;
  line-height: inherit;
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
    background: rgba(255, 255, 255, 0.05);
    padding: 4px 8px;
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

.notif-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 13px;
}

.notif-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
}

.notif-item {
  padding: 12px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.notif-app-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.notif-app-icon {
  font-size: 14px;
}

.notif-app-name {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  flex: 1;
}

.notif-close {
  color: rgba(255, 255, 255, 0.4);
  font-size: 10px;
}

.notif-title {
  font-size: 13px;
  font-weight: 600;
  color: white;
  margin-bottom: 2px;
  font-family: inherit;
  line-height: inherit;
}

.notif-msg {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  margin: 0;
}

.calendar-section {
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.cal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.cal-month {
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
  font-family: inherit;
  line-height: inherit;
}

.cal-controls {
  display: flex;
  gap: 4px;
}

.cal-controls button {
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  text-align: center;
}

.cal-day-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  padding: 8px 0;
}

.cal-day {
  font-size: 12px;
  padding: 8px 0;
  color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  cursor: default;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.today {
    background: var(--accent);
    color: white;
    font-weight: 600;
  }
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: all 0.25s cubic-bezier(0.1, 0.9, 0.2, 1);
}

.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
