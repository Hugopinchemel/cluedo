import { ref } from 'vue'
import { ICON_FLUENT_UPDATE, ICON_FLUENT_SECURITY, ICON_FLUENT_ALERT } from '~/composables/icons'

export interface WinNotification {
  id: string
  app: string
  title: string
  message: string
  icon?: string
  timestamp: Date
}

const notifications = ref<WinNotification[]>([
  {
    id: 'update',
    app: 'Windows Update',
    title: 'Mise à jour prête',
    message: 'Une mise à jour importante est prête à être installée.',
    icon: ICON_FLUENT_UPDATE,
    timestamp: new Date()
  },
  {
    id: 'security',
    app: 'Sécurité Windows',
    title: 'Analyse terminée',
    message: 'Aucune menace n\'a été détectée lors de la dernière analyse.',
    icon: ICON_FLUENT_SECURITY,
    timestamp: new Date()
  },
])

export const useNotifications = () => {
  const addNotification = (notif: Omit<WinNotification, 'id' | 'timestamp'>) => {
    const newNotif: WinNotification = {
      ...notif,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date()
    }
    notifications.value.unshift(newNotif)
    return newNotif
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    notifications.value = []
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  }
}
