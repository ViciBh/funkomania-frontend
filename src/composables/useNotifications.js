/**
 * Composable de notificaciones del frontend de Funkomanía.
 * Gestiona el estado reactivo de las notificaciones del usuario autenticado.
 *
 * @author Viktoriia Bohoslavska
 */
import { computed, ref } from 'vue'
import { getUserNotifications, markNotificationAsRead } from '@/services/notificationService'

const notifications = ref([])
const notificationsLoading = ref(false)
const notificationsError = ref('')
const notificationsLoaded = ref(false)
const unreadNotificationsCount = computed(() => {
  return notifications.value.filter((notification) => isNotificationUnread(notification)).length
})

function hasToken() {
  return !!localStorage.getItem('token')
}

function fixMojibake(text) {
  if (!text) return ''

  try {
    return decodeURIComponent(escape(text))
  } catch {
    return text
  }
}

function isNotificationUnread(notification) {
  const estado = notification.estadoNotificacion || notification.estado || ''
  return estado.toUpperCase() === 'PENDIENTE'
}

function normalizeNotification(notification) {
  return {
    idNotificacion: notification.idNotificacion,
    idUsuario: notification.idUsuario,
    tipoNotificacion: notification.tipoNotificacion || 'NOTIFICACION',
    estadoNotificacion: notification.estadoNotificacion || 'PENDIENTE',
    mensaje: fixMojibake(notification.mensaje || 'Nueva notificación')
  }
}

async function loadNotifications() {
  if (!hasToken()) {
    notifications.value = []
    notificationsLoaded.value = false
    return
  }
  notificationsLoading.value = true
  notificationsError.value = ''
  try {
    const data = await getUserNotifications()
    notifications.value = data.map(normalizeNotification)
    notificationsLoaded.value = true
  } catch (error) {
    notificationsError.value = 'No se pudieron cargar las notificaciones.'
    console.error('Error cargando notificaciones:', error)
  } finally {
    notificationsLoading.value = false
  }
}

async function readNotification(idNotificacion) {
  if (!hasToken()) return
  try {
    await markNotificationAsRead(idNotificacion)
    notifications.value = notifications.value.map((notification) => {
      if (notification.idNotificacion !== idNotificacion) return notification
      return { ...notification, estadoNotificacion: 'LEIDA' }
    })
  } catch (error) {
    notificationsError.value = 'No se pudo marcar la notificación como leída.'
    console.error('Error marcando notificación como leída:', error)
  }
}

function clearNotifications() {
  notifications.value = []
  notificationsLoaded.value = false
  notificationsError.value = ''
}

export {
  notifications,
  notificationsLoading,
  notificationsError,
  notificationsLoaded,
  unreadNotificationsCount,
  isNotificationUnread,
  loadNotifications,
  readNotification,
  clearNotifications
}