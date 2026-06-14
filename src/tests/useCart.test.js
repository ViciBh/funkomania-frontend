/**
 * Pruebas unitarias del composable useCart
 * Comprueba la gestión del carrito para usuarios invitados mediante localStorage: añadir productos, modificar cantidades, calcular totales y vaciar el carrito.
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

async function loadUseCart() {
  vi.resetModules()
  return await import('@/composables/useCart')
}

const product = {
  idProducto: 1,
  Nombre: 'Darth Vader',
  PrecioFinal_SinIVA: 10,
  PrecioFinal_ConIVA: 12.1,
  iva: 21,
  Stock: 3,
  Image: null
}

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('añade un producto al carrito local', async () => {
    const { getCart, addToCart, cartCount, cartTotal } = await loadUseCart()
    await addToCart(product)
    expect(getCart().value).toHaveLength(1)
    expect(getCart().value[0].Nombre).toBe('Darth Vader')
    expect(cartCount.value).toBe(1)
    expect(cartTotal.value).toBe(12.1)
  })

  it('aumenta y disminuye cantidades', async () => {
    const { getCart, addToCart, increaseQuantity, decreaseQuantity, cartCount } = await loadUseCart()
    await addToCart(product)
    await increaseQuantity(1)
    expect(getCart().value[0].Cantidad).toBe(2)
    expect(cartCount.value).toBe(2)
    await decreaseQuantity(1)
    expect(getCart().value[0].Cantidad).toBe(1)
  })

  it('no permite superar el stock disponible', async () => {
    const { getCart, addToCart, increaseQuantity, cartError } = await loadUseCart()
    await addToCart(product)
    await increaseQuantity(1)
    await increaseQuantity(1)
    await increaseQuantity(1)
    expect(getCart().value[0].Cantidad).toBe(3)
    expect(cartError.value).toBe('No hay stock suficiente.')
  })

  it('elimina un producto y vacía el carrito', async () => {
    const { getCart, addToCart, removeProductFromCart, clearCart } = await loadUseCart()
    await addToCart(product)
    await removeProductFromCart(1)
    expect(getCart().value).toHaveLength(0)
    await addToCart(product)
    await clearCart()
    expect(getCart().value).toHaveLength(0)
  })
})