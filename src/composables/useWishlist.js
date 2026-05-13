import { ref } from 'vue'
const wishlist = ref(JSON.parse(localStorage.getItem('wishlist')) || [])
export const wishlistCount = ref(wishlist.value.length)

function saveWishlist() {
  localStorage.setItem('wishlist', JSON.stringify(wishlist.value))
  wishlistCount.value = wishlist.value.length
}

export function getWishlist() {
  return wishlist
}

export function isInWishlist(idProducto) {
  return wishlist.value.some((product) => product.idProducto === idProducto)
}

export function addToWishlist(product) {
  if (!isInWishlist(product.idProducto)) {
    wishlist.value.push(product)
    saveWishlist()
  }
}

export function removeFromWishlist(idProducto) {
  wishlist.value = wishlist.value.filter((product) => product.idProducto !== idProducto)
  saveWishlist()
}

export function toggleWishlist(product) {
  if (isInWishlist(product.idProducto)) {
    removeFromWishlist(product.idProducto)
  } else {
    addToWishlist(product)
  }
}