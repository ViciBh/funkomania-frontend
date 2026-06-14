/**
 * Pruebas unitarias del servicio de notificaciones.
 * Comprueba los endpoints usados para obtener notificaciones y marcarlas como leídas.
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

const apiMocks = vi.hoisted(() => ({ apiRequest: vi.fn() }))

vi.mock('@/services/api', () => ({ apiRequest: apiMocks.apiRequest }))

import { getUserNotifications, markNotificationAsRead } from '@/services/notificationService'

describe('notificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('obtiene las notificaciones del usuario', async () => {
    await getUserNotifications()
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/usuario/notificaciones/')
  })

  it('marca una notificación como leída', async () => {
    await markNotificationAsRead(4)
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/usuario/notificaciones/4/leer', { method: 'PUT' })
  })
})