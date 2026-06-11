/**
 * Servicio de notificaciones del frontend de Funkomanía.
 * Conecta las notificaciones del usuario autenticado con la API backend.
 *
 * @author Viktoriia Bohoslavska
 */
import { apiRequest } from './api'

export async function getUserNotifications() {
  return apiRequest('/usuario/notificaciones/')
}

export async function markNotificationAsRead(idNotificacion) {
  return apiRequest(`/usuario/notificaciones/${idNotificacion}/leer`, { method: 'PUT' })
}