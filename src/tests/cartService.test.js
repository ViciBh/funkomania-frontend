/**
 * Pruebas unitarias del servicio de carrito
 * Comprueba que cada operación del carrito llama al endpoint correcto y utiliza el método HTTP esperado.
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

const apiMocks = vi.hoisted(() => ({ apiRequest: vi.fn() }))

vi.mock('@/services/api', () => ({ apiRequest: apiMocks.apiRequest }))

import { getBackendCart, addBackendCartProduct, updateBackendCartProduct, deleteBackendCartProduct, clearBackendCart } from '@/services/cartService'

describe('cartService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('obtiene el carrito del usuario', async () => {
    await getBackendCart()
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/carrito/')
  })

  it('añade un producto al carrito', async () => {
    await addBackendCartProduct(7, 2)
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/carrito/7?cantidad=2', { method: 'POST' })
  })

  it('actualiza la cantidad de un producto', async () => {
    await updateBackendCartProduct(7, 3)
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/carrito/7?cantidad=3', { method: 'PUT' })
  })

  it('elimina un producto del carrito', async () => {
    await deleteBackendCartProduct(7)
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/carrito/7', { method: 'DELETE' })
  })

  it('vacía todo el carrito', async () => {
    await clearBackendCart()
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/carrito/', { method: 'DELETE' })
  })
})