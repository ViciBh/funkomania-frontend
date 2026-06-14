/**
 * Pruebas unitarias del composable useNotifications
 * Comprueba la carga, filtrado y lectura de notificaciones del usuario
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

const notificationMocks = vi.hoisted(() => ({
  getUserNotifications: vi.fn(),
  markNotificationAsRead: vi.fn()
}))

vi.mock('@/services/notificationService', () => notificationMocks)

async function loadUseNotifications() {
  vi.resetModules()
  return await import('@/composables/useNotifications')
}

describe('useNotifications', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('no carga notificaciones si no hay token', async () => {
    const { notifications, loadNotifications } = await loadUseNotifications()
    await loadNotifications()
    expect(notifications.value).toEqual([])
    expect(notificationMocks.getUserNotifications).not.toHaveBeenCalled()
  })

  it('carga solo notificaciones enviadas o leídas', async () => {
    localStorage.setItem('token', 'token-test')
    notificationMocks.getUserNotifications.mockResolvedValue([
      { idNotificacion: 1, estado: 'ENVIADA', mensaje: 'Compra realizada' },
      { idNotificacion: 2, estado: 'PENDIENTE', mensaje: 'No mostrar' },
      { idNotificacion: 3, estado: 'LEIDA', mensaje: 'Pedido enviado' }
    ])

    const { notifications, unreadNotificationsCount, loadNotifications } = await loadUseNotifications()
    await loadNotifications()
    expect(notifications.value).toHaveLength(2)
    expect(unreadNotificationsCount.value).toBe(1)
  })

  it('marca una notificación como leída', async () => {
    localStorage.setItem('token', 'token-test')
    notificationMocks.getUserNotifications.mockResolvedValue([
      { idNotificacion: 1, estado: 'ENVIADA', mensaje: 'Compra realizada' }
    ])
    notificationMocks.markNotificationAsRead.mockResolvedValue({})
    const { notifications, loadNotifications, readNotification } = await loadUseNotifications()
    await loadNotifications()
    await readNotification(1)
    expect(notificationMocks.markNotificationAsRead).toHaveBeenCalledWith(1)
    expect(notifications.value[0].estadoNotificacion).toBe('LEIDA')
  })
})