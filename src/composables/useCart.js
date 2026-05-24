import { computed, ref } from 'vue'

const cart = ref(JSON.parse(localStorage.getItem('cart')) || [])

// Simulación temporal hasta conectar con Spring Boot
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart.value))
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

export function addToCart(product) {
  const item = cart.value.find((cartProduct) => cartProduct.idProducto === product.idProducto)

  if (item) {
    item.Cantidad++
  } else {
    cart.value.push({
      idProducto: product.idProducto,
      Nombre: product.Nombre,
      PrecioSinIva: product.PrecioFinal_SinIVA,
      PrecioConIva: product.PrecioFinal_ConIVA,
      iva: product.iva,
      Image: product.Image,
      Stock: product.Stock,
      Cantidad: 1
    })
  }

  saveCart()
}

export function increaseQuantity(idProducto) {
  const item = cart.value.find((product) => product.idProducto === idProducto)
  item.Cantidad++
  saveCart()
}

export function decreaseQuantity(idProducto) {
  const item = cart.value.find((product) => product.idProducto === idProducto)
  if (item.Cantidad > 1) {
    item.Cantidad--
  } else {
    removeProductFromCart(idProducto)
    return
  }
  saveCart()
}

export function removeProductFromCart(idProducto) {
  cart.value = cart.value.filter((product) => product.idProducto !== idProducto)
  saveCart()
}

export function clearCart() {
  cart.value = []
  saveCart()
}