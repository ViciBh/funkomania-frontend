/**
 * Pruebas de componente para CartSidebar
 * Comprueba el comportamiento del carrito lateral: estado vacío, visualización de productos, cierre del panel y botones de cantidad/eliminación
 *
 * @author Viktoriia Bohoslavska
 */

import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const cartMocks = vi.hoisted(() => ({
  cartRef: null,
  increaseQuantity: vi.fn(),
  decreaseQuantity: vi.fn(),
  removeProductFromCart: vi.fn()
}))

const authMocks = vi.hoisted(() => ({
  authenticated: false
}))

vi.mock('@/composables/useCart', async () => {
  const { ref, computed } = await import('vue')

  cartMocks.cartRef = ref([])

  return {
    getCart: () => cartMocks.cartRef,
    increaseQuantity: cartMocks.increaseQuantity,
    decreaseQuantity: cartMocks.decreaseQuantity,
    removeProductFromCart: cartMocks.removeProductFromCart,
    cartTotal: computed(() => {
      return Number(cartMocks.cartRef.value.reduce((sum, product) => {
        return sum + Number(product.PrecioConIva || 0) * Number(product.Cantidad || 0)
      }, 0).toFixed(2))
    })
  }
})

vi.mock('@/composables/useAuth', async () => {
  const { ref } = await import('vue')

  return {
    useAuth: () => ({
      isAuthenticated: ref(authMocks.authenticated),
      getLoginRedirect: (path) => ({
        path: '/login',
        query: { redirect: path }
      })
    })
  }
})

vi.mock('@/data/products', () => ({
  getProductImage: (image) => image || null
}))

import CartSidebar from '@/components/CartSidebar.vue'

const RouterLinkStub = {
  props: ['to'],
  template: '<a :href="typeof to === \'string\' ? to : to.path"><slot /></a>'
}

function mountSidebar(open = true) {
  return mount(CartSidebar, {
    props: { open },
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
        X: true,
        Plus: true,
        Minus: true,
        Trash2: true,
        ShoppingBag: true
      }
    }
  })
}

describe('CartSidebar', () => {
  beforeEach(() => {
    cartMocks.cartRef.value = []
    cartMocks.increaseQuantity.mockClear()
    cartMocks.decreaseQuantity.mockClear()
    cartMocks.removeProductFromCart.mockClear()
    authMocks.authenticated = false
  })

  it('no se muestra cuando open es false', () => {
    const wrapper = mountSidebar(false)
    expect(wrapper.find('.cart-sidebar-overlay').exists()).toBe(false)
  })

  it('muestra el estado vacío cuando no hay productos', () => {
    const wrapper = mountSidebar()
    expect(wrapper.text()).toContain('Tu carrito está vacío')
    expect(wrapper.text()).toContain('Añade productos desde el catálogo.')
    expect(wrapper.text()).toContain('0.00€')
  })

  it('muestra los productos del carrito y el total', () => {
    cartMocks.cartRef.value = [
      {
        idProducto: 1,
        Nombre: 'Darth Vader',
        PrecioConIva: 24.2,
        Cantidad: 2,
        Image: null
      }
    ]

    const wrapper = mountSidebar()
    expect(wrapper.text()).toContain('Darth Vader')
    expect(wrapper.text()).toContain('24.20€')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('48.40€')
  })

  it('emite close al pulsar el botón de cerrar', async () => {
    const wrapper = mountSidebar()
    await wrapper.find('.cart-sidebar-close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emite close al hacer click en el overlay', async () => {
    const wrapper = mountSidebar()
    await wrapper.find('.cart-sidebar-overlay').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('ejecuta acciones de cantidad y eliminación', async () => {
    cartMocks.cartRef.value = [
      {
        idProducto: 1,
        Nombre: 'Darth Vader',
        PrecioConIva: 24.2,
        Cantidad: 2,
        Image: null
      }
    ]

    const wrapper = mountSidebar()
    const buttons = wrapper.findAll('.cart-sidebar-controls button')
    await buttons[0].trigger('click')
    await buttons[1].trigger('click')
    await buttons[2].trigger('click')
    expect(cartMocks.decreaseQuantity).toHaveBeenCalledWith(1)
    expect(cartMocks.increaseQuantity).toHaveBeenCalledWith(1)
    expect(cartMocks.removeProductFromCart).toHaveBeenCalledWith(1)
  })
})