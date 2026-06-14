/**
 * Pruebas unitarias del composable useWishlist
 * Comprueba la carga, inserción, eliminación y conteo de productos en la lista de deseos del usuario autenticado.
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

const wishlistMocks = vi.hoisted(() => ({
  getWishlistProducts: vi.fn(),
  addWishlistProduct: vi.fn(),
  deleteWishlistProduct: vi.fn()
}))

vi.mock('@/services/wishlistService', () => wishlistMocks)

async function loadUseWishlist() {
  vi.resetModules()
  return await import('@/composables/useWishlist')
}

const backendProduct = {
  id: 1,
  nombre: 'Iron Man',
  precio: 20,
  iva: 21,
  enOferta: false,
  descuento: 0,
  stock: 5,
  imagen: 'iron-man.png',
  activo: true,
  descripcion: 'Figura Iron Man'
}

describe('useWishlist', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('carga productos de la lista de deseos si hay token', async () => {
    localStorage.setItem('token', 'token-test')
    wishlistMocks.getWishlistProducts.mockResolvedValue([backendProduct])
    const { getWishlist, loadWishlist, wishlistCount } = await loadUseWishlist()
    await loadWishlist()
    expect(getWishlist().value).toHaveLength(1)
    expect(getWishlist().value[0].Nombre).toBe('Iron Man')
    expect(wishlistCount.value).toBe(1)
  })

  it('añade un producto a la lista de deseos', async () => {
    localStorage.setItem('token', 'token-test')
    wishlistMocks.addWishlistProduct.mockResolvedValue({})
    const { getWishlist, addToWishlist, isInWishlist } = await loadUseWishlist()
    await addToWishlist({ idProducto: 2, Nombre: 'Groot', PrecioFinal_SinIVA: 10, PrecioFinal_ConIVA: 12.1 })
    expect(wishlistMocks.addWishlistProduct).toHaveBeenCalledWith(2)
    expect(getWishlist().value).toHaveLength(1)
    expect(isInWishlist(2)).toBe(true)
  })

  it('elimina un producto de la lista de deseos', async () => {
    localStorage.setItem('token', 'token-test')
    wishlistMocks.addWishlistProduct.mockResolvedValue({})
    wishlistMocks.deleteWishlistProduct.mockResolvedValue({})
    const { getWishlist, addToWishlist, removeFromWishlist } = await loadUseWishlist()
    await addToWishlist({ idProducto: 2, Nombre: 'Groot' })
    await removeFromWishlist(2)
    expect(wishlistMocks.deleteWishlistProduct).toHaveBeenCalledWith(2)
    expect(getWishlist().value).toHaveLength(0)
  })
})