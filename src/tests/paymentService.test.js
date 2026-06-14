/**
 * Pruebas unitarias del servicio de métodos de pago
 * Este archivo comprueba que solo se muestran métodos de pago activos y que se adaptan al formato usado por el checkout.
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

const apiMocks = vi.hoisted(() => ({
  apiRequest: vi.fn()
}))

vi.mock('@/services/api', () => ({
  apiRequest: apiMocks.apiRequest
}))

import { getPaymentMethods } from '@/services/paymentService'

describe('paymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('obtiene solo métodos de pago activos', async () => {
    apiMocks.apiRequest.mockResolvedValue([
      { id: 1, nombre: 'Tarjeta bancaria', activo: true },
      { id: 2, nombre: 'PayPal', activo: false },
      { id: 3, nombre: 'Bizum', activo: true }
    ])
    const methods = await getPaymentMethods()
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/metodos-pago/')
    expect(methods).toHaveLength(2)
    expect(methods.map((method) => method.Nombre)).toEqual(['Tarjeta bancaria', 'Bizum'])
  })

  it('adapta tarjeta bancaria al tipo card', async () => {
    apiMocks.apiRequest.mockResolvedValue([
      { id: 1, nombre: 'Tarjeta bancaria', activo: true }
    ])
    const methods = await getPaymentMethods()
    expect(methods[0]).toEqual({
      idMetodoPago: 1,
      Nombre: 'Tarjeta bancaria',
      Activo: 1,
      Mensaje: 'Introduce los datos de una tarjeta ficticia para simular el pago.',
      Tipo: 'card'
    })
  })

  it('asigna tipo genérico a métodos desconocidos', async () => {
    apiMocks.apiRequest.mockResolvedValue([
      { id: 9, nombre: 'Método personalizado', activo: true }
    ])
    const methods = await getPaymentMethods()
    expect(methods[0].Tipo).toBe('generic')
    expect(methods[0].Mensaje).toBe('Método de pago simulado.')
  })
})