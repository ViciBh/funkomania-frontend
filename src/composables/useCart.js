import { ref } from 'vue'

const cart = ref(JSON.parse(localStorage.getItem('cart')) || [])

export const cartCount = ref(cart.value.length)

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart.value))
  cartCount.value = cart.value.length
}

export function getCart() {
  return cart
}

export function addToCart(product) {
  cart.value.push({
    id: product.idProducto,
    Nombre: product.Nombre,
    Precio: product.Precio,
    Image: product.Image
  })

  saveCart()
}

export function removeFromCart(index) {
  cart.value.splice(index, 1)
  saveCart()
}