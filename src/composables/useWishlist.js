/**
 * Composable de lista de deseos del frontend de Funkomanía.
 * Gestiona la lista de deseos del usuario autenticado mediante la API backend.
 *
 * @author Viktoriia Bohoslavska
 */
import { computed, ref } from 'vue'
import { getWishlistProducts, addWishlistProduct, deleteWishlistProduct } from '@/services/wishlistService'

const wishlist = ref([])
const wishlistLoading = ref(false)
const wishlistError = ref('')
const wishlistLoaded = ref(false)

export const wishlistCount = computed(() => wishlist.value.length)

function hasToken() {
  return !!localStorage.getItem('token')
}

function redirectToLogin() {
  const redirect = window.location.pathname + window.location.search
  window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`
}

function roundPrice(value) {
  return Math.round(Number(value || 0) * 100) / 100
}

function isBackendOfferActive(product) {
  if (!product.enOferta || Number(product.descuento || 0) <= 0) return false
  if (!product.fechaFinOferta) return true
  return new Date(product.fechaFinOferta) >= new Date()
}

function getPriceWithIva(price, iva) {
  return roundPrice(Number(price || 0) * (1 + Number(iva || 0) / 100))
}

function getDiscountedPrice(product) {
  const originalPrice = Number(product.precio || product.precioOriginalSinIVA || 0)

  if (!isBackendOfferActive(product)) return roundPrice(originalPrice)

  return roundPrice(originalPrice * (1 - Number(product.descuento || 0) / 100))
}

function mapWishlistProductFromBackend(product) {
  const precioOriginalSinIva = roundPrice(product.precio || product.precioOriginalSinIVA || 0)
  const precioFinalSinIva = getDiscountedPrice(product)
  const iva = Number(product.iva || 0)

  return {
    idProducto: product.id,
    Nombre: product.nombre,
    PrecioOriginal_SinIVA: precioOriginalSinIva,
    PrecioOriginal_ConIVA: getPriceWithIva(precioOriginalSinIva, iva),
    EnOferta: product.enOferta ? 1 : 0,
    Descuento: Number(product.descuento || 0),
    FechaFinOferta: product.fechaFinOferta,
    PrecioFinal_SinIVA: precioFinalSinIva,
    PrecioFinal_ConIVA: getPriceWithIva(precioFinalSinIva, iva),
    iva,
    Stock: Number(product.stock || 0),
    Image: product.imagen,
    Descripcion: product.descripcion,
    Activo: product.activo ? 1 : 0,
    idCategoria: product.idCategoria || null,
    NombreCategoria: product.nombreCategoria || 'Lista de deseos',
    NombreCategoriaPadre: product.nombreCategoriaPadre || null,
    Precio: precioFinalSinIva
  }
}

function normalizeFrontendProduct(product) {
  return {
    ...product,
    idProducto: product.idProducto || product.id,
    Nombre: product.Nombre || product.nombre,
    PrecioOriginal_SinIVA: Number(product.PrecioOriginal_SinIVA ?? product.precio ?? product.precioOriginalSinIVA ?? 0),
    PrecioOriginal_ConIVA: Number(product.PrecioOriginal_ConIVA ?? product.precioOriginalConIVA ?? 0),
    EnOferta: product.EnOferta ?? (product.enOferta ? 1 : 0),
    Descuento: Number(product.Descuento ?? product.descuento ?? 0),
    FechaFinOferta: product.FechaFinOferta ?? product.fechaFinOferta,
    PrecioFinal_SinIVA: Number(product.PrecioFinal_SinIVA ?? product.precioFinalSinIVA ?? product.precio ?? 0),
    PrecioFinal_ConIVA: Number(product.PrecioFinal_ConIVA ?? product.precioFinalConIVA ?? 0),
    iva: Number(product.iva ?? 0),
    Stock: Number(product.Stock ?? product.stock ?? 0),
    Image: product.Image ?? product.imagen,
    Descripcion: product.Descripcion ?? product.descripcion,
    Activo: product.Activo ?? (product.activo ? 1 : 0),
    idCategoria: product.idCategoria || null,
    NombreCategoria: product.NombreCategoria || product.nombreCategoria || 'Lista de deseos',
    NombreCategoriaPadre: product.NombreCategoriaPadre || product.nombreCategoriaPadre || null
  }
}

function getWishlist() {
  return wishlist
}

function isInWishlist(idProducto) {
  return wishlist.value.some((product) => product.idProducto === idProducto)
}

async function loadWishlist() {
  if (!hasToken()) {
    wishlist.value = []
    wishlistLoaded.value = false
    return
  }
  wishlistLoading.value = true
  wishlistError.value = ''
  try {
    const data = await getWishlistProducts()
    wishlist.value = data.map(mapWishlistProductFromBackend)
    wishlistLoaded.value = true
  } catch (error) {
    wishlistError.value = 'No se pudo cargar la lista de deseos.'
    console.error('Error cargando lista de deseos:', error)
  } finally {
    wishlistLoading.value = false
  }
}

async function addToWishlist(product) {
  if (!hasToken()) {
    redirectToLogin()
    return
  }
  const normalizedProduct = normalizeFrontendProduct(product)
  if (isInWishlist(normalizedProduct.idProducto)) return
  try {
    await addWishlistProduct(normalizedProduct.idProducto)
    wishlist.value.push(normalizedProduct)
  } catch (error) {
    if (error.message?.includes('409')) {
      if (!isInWishlist(normalizedProduct.idProducto)) wishlist.value.push(normalizedProduct)
      return
    }
    wishlistError.value = 'No se pudo añadir el producto a la lista de deseos.'
    console.error('Error añadiendo producto a lista de deseos:', error)
  }
}

async function removeFromWishlist(idProducto) {
  if (!hasToken()) {
    redirectToLogin()
    return
  }
  try {
    await deleteWishlistProduct(idProducto)
    wishlist.value = wishlist.value.filter((product) => product.idProducto !== idProducto)
  } catch (error) {
    wishlistError.value = 'No se pudo eliminar el producto de la lista de deseos.'
    console.error('Error eliminando producto de lista de deseos:', error)
  }
}

async function toggleWishlist(product) {
  const idProducto = product.idProducto || product.id
  if (isInWishlist(idProducto)) {
    await removeFromWishlist(idProducto)
    return
  }
  await addToWishlist(product)
}

function clearWishlist() {
  wishlist.value = []
  wishlistLoaded.value = false
  wishlistError.value = ''
}

export {
  getWishlist,
  isInWishlist,
  loadWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  wishlistLoading,
  wishlistError,
  wishlistLoaded
}