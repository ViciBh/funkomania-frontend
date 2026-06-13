/**
 * Composable para la gestión del carrito de compra de Funkomanía.
 * Usa localStorage para usuarios invitados y backend para usuarios autenticados.
 * Si un invitado inicia sesión, los productos temporales se migran al carrito real del backend.
 * Al cerrar sesión, se limpia el carrito local para no mezclar datos entre usuarios.
 *
 * @author IVAN RODRIGUEZ LOREDO
 * @author Viktoriia Bohoslavska
 */
import { computed, ref, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { getBackendCart, addBackendCartProduct, updateBackendCartProduct, deleteBackendCartProduct, clearBackendCart } from '@/services/cartService'

const LOCAL_CART_KEY = 'cart'
const cart = ref(JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [])
const cartLoading = ref(false)
const cartError = ref('')
const { isAuthenticated } = useAuth()

function saveLocalCart() {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart.value))
}

function getLocalCart() {
  return JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || []
}

function removeLocalCart() {
  localStorage.removeItem(LOCAL_CART_KEY)
}

function setEmptyCart() {
  cart.value = []
}

function mapBackendItem(item = {}) {
  return {
    idProducto: item.idProducto,
    Nombre: item.producto || item.nombre || item.Nombre || '',
    PrecioSinIva: Number(item.precioUnitarioSinIVA || item.precioUnitario_SinIVA || item.PrecioSinIva || 0),
    PrecioConIva: Number(item.precioUnitarioConIVA || item.precioUnitario_ConIVA || item.PrecioConIva || 0),
    iva: Number(item.ivaPorcentaje || item.IVA_Porcentaje || item.iva || 0),
    Image: item.image || item.Image || null,
    Stock: item.stock ?? item.Stock ?? 999,
    Cantidad: Number(item.cantidad || item.Cantidad || 0)
  }
}

function setCartFromBackend(data) {
  if (Array.isArray(data?.items)) {
    cart.value = data.items.map(mapBackendItem)
    return
  }
  if (Array.isArray(data)) {
    cart.value = data.map(mapBackendItem)
    return
  }
  cart.value = []
}

function mapLocalProduct(product) {
  return {
    idProducto: product.idProducto,
    Nombre: product.Nombre,
    PrecioSinIva: Number(product.PrecioFinal_SinIVA || product.PrecioSinIva || product.PrecioOriginal_SinIVA || product.Precio || 0),
    PrecioConIva: Number(product.PrecioFinal_ConIVA || product.PrecioConIva || product.PrecioOriginal_ConIVA || product.PrecioConIVA || 0),
    iva: Number(product.iva || 0),
    Image: product.Image || null,
    Stock: product.Stock ?? 999,
    Cantidad: 1
  }
}

async function migrateLocalCartToBackend() {
  const localCart = getLocalCart()
  if (localCart.length === 0) return
  for (const product of localCart) {
    if (!product.idProducto || !product.Cantidad) continue
    await addBackendCartProduct(product.idProducto, product.Cantidad)
  }
  removeLocalCart()
}

export async function loadCart() {
  cartError.value = ''
  if (!isAuthenticated.value) {
    cart.value = getLocalCart()
    return
  }
  cartLoading.value = true
  try {
    const data = await getBackendCart()
    setCartFromBackend(data)
  } catch (error) {
    setEmptyCart()
    cartError.value = 'No se pudo cargar el carrito.'
    console.error('Error cargando carrito:', error)
  } finally {
    cartLoading.value = false
  }
}

export const cartCount = computed(() => {
  return cart.value.reduce((sum, product) => sum + product.Cantidad, 0)
})

export const cartBaseTotal = computed(() => {
  return Number(cart.value.reduce((sum, product) => sum + product.PrecioSinIva * product.Cantidad, 0).toFixed(2))
})

export const cartIvaTotal = computed(() => {
  return Number((cartTotal.value - cartBaseTotal.value).toFixed(2))
})

export const cartTotal = computed(() => {
  return Number(cart.value.reduce((sum, product) => sum + product.PrecioConIva * product.Cantidad, 0).toFixed(2))
})

export function getCart() {
  return cart
}

export async function addToCart(product) {
  cartError.value = ''
  if (isAuthenticated.value) {
    try {
      await addBackendCartProduct(product.idProducto, 1)
      await loadCart()
    } catch (error) {
      cartError.value = 'No se pudo añadir el producto al carrito.'
      console.error('Error añadiendo producto al carrito:', error)
    }
    return
  }
  if (product.Stock !== undefined && product.Stock <= 0) {
    cartError.value = 'No hay stock disponible para este producto.'
    return
  }
  const item = cart.value.find((cartProduct) => cartProduct.idProducto === product.idProducto)
  if (item) {
    if (item.Cantidad >= item.Stock) {
      cartError.value = 'No hay stock suficiente.'
      return
    }
    item.Cantidad++
  } else {
    cart.value.push(mapLocalProduct(product))
  }
  saveLocalCart()
}

export async function increaseQuantity(idProducto) {
  cartError.value = ''
  const item = cart.value.find((product) => product.idProducto === idProducto)
  if (!item) return
  if (isAuthenticated.value) {
    try {
      await updateBackendCartProduct(idProducto, item.Cantidad + 1)
      await loadCart()
    } catch (error) {
      cartError.value = 'No se pudo aumentar la cantidad.'
      console.error('Error aumentando cantidad:', error)
    }
    return
  }
  if (item.Cantidad >= item.Stock) {
    cartError.value = 'No hay stock suficiente.'
    return
  }
  item.Cantidad++
  saveLocalCart()
}

export async function decreaseQuantity(idProducto) {
  cartError.value = ''
  const item = cart.value.find((product) => product.idProducto === idProducto)
  if (!item) return
  if (isAuthenticated.value) {
    try {
      if (item.Cantidad > 1) {
        await updateBackendCartProduct(idProducto, item.Cantidad - 1)
      } else {
        await deleteBackendCartProduct(idProducto)
      }
      await loadCart()
    } catch (error) {
      cartError.value = 'No se pudo disminuir la cantidad.'
      console.error('Error disminuyendo cantidad:', error)
    }
    return
  }
  if (item.Cantidad > 1) {
    item.Cantidad--
  } else {
    cart.value = cart.value.filter((product) => product.idProducto !== idProducto)
  }
  saveLocalCart()
}

export async function removeProductFromCart(idProducto) {
  cartError.value = ''
  if (isAuthenticated.value) {
    try {
      await deleteBackendCartProduct(idProducto)
      await loadCart()
    } catch (error) {
      cartError.value = 'No se pudo eliminar el producto del carrito.'
      console.error('Error eliminando producto del carrito:', error)
    }
    return
  }
  cart.value = cart.value.filter((product) => product.idProducto !== idProducto)
  saveLocalCart()
}

export async function clearCart() {
  cartError.value = ''
  if (isAuthenticated.value) {
    try {
      await clearBackendCart()
      await loadCart()
    } catch (error) {
      cartError.value = 'No se pudo vaciar el carrito.'
      console.error('Error vaciando carrito:', error)
    }
    return
  }
  setEmptyCart()
  saveLocalCart()
}

watch(isAuthenticated, async (authenticated, wasAuthenticated) => {
  if (authenticated) {
    cartLoading.value = true
    try {
      await migrateLocalCartToBackend()
      await loadCart()
    } catch (error) {
      cartError.value = 'No se pudo sincronizar el carrito temporal.'
      console.error('Error migrando carrito local al backend:', error)
      await loadCart()
    } finally {
      cartLoading.value = false
    }

    return
  }
  if (wasAuthenticated) {
    setEmptyCart()
    removeLocalCart()
    return
  }
  cart.value = getLocalCart()
}, { immediate: true })

export {
  cartLoading,
  cartError
}