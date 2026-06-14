/**
 * Pruebas unitarias del servicio de lista de deseos
 * Comprueba los endpoints usados para consultar, añadir y eliminar productos favoritos.
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

const apiMocks = vi.hoisted(() => ({ apiRequest: vi.fn() }))

vi.mock('@/services/api', () => ({ apiRequest: apiMocks.apiRequest }))

import { getWishlistProducts, addWishlistProduct, deleteWishlistProduct } from '@/services/wishlistService'

describe('wishlistService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('obtiene los productos de la lista de deseos', async () => {
    await getWishlistProducts()
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/usuario/lista-deseos/')
  })

  it('añade un producto a la lista de deseos', async () => {
    await addWishlistProduct(8)
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/usuario/lista-deseos/8', { method: 'POST' })
  })

  it('elimina un producto de la lista de deseos', async () => {
    await deleteWishlistProduct(8)
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/usuario/lista-deseos/8', { method: 'DELETE' })
  })
})