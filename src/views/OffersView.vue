/**
 * Vista de ofertas de Funkomanía.
 * Muestra los productos con descuentos activos y permite añadirlos al carrito o a la lista de deseos.
 *
 * @author Viktoriia Bohoslavska
 */
<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ShoppingCart, Heart } from 'lucide-vue-next'
import { getOfferProducts } from '@/services/productService'
// Funcionalidad de añadir productos al carrito implementada por IVAN RODRIGUEZ LOREDO.
import { addToCart } from '@/composables/useCart'
import { toggleWishlist, isInWishlist, loadWishlist } from '@/composables/useWishlist'

const offerProducts = ref([])
const loading = ref(false)
const errorMessage = ref('')
const currentPage = ref(0)
const pageSize = ref(8)
const totalPages = ref(0)
const totalElements = ref(0)
const firstPage = ref(true)
const lastPage = ref(true)

/**
 * Carga los productos en oferta desde la API backend.
 */
async function loadOfferProducts() {
  loading.value = true
  errorMessage.value = ''

  try {
    const data = await getOfferProducts({
      page: currentPage.value,
      size: pageSize.value
    })

    offerProducts.value = data.products
    totalPages.value = data.totalPages
    totalElements.value = data.totalElements
    firstPage.value = data.first
    lastPage.value = data.last
  } catch (error) {
    errorMessage.value = 'No se pudieron cargar las ofertas'
    console.error('Error cargando ofertas:', error)
  } finally {
    loading.value = false
  }
}

/**
 * Comprueba si una oferta está activa según los datos recibidos del backend.
 */
function isOfertaActiva(product) {
  return product.EnOferta === 1 &&
    product.Descuento > 0 &&
    (!product.FechaFinOferta || new Date(product.FechaFinOferta) >= new Date())
}

/**
 * Devuelve la imagen del producto si existe.
 */
function getProductImage(image) {
  return image || null
}

/**
 * Cambia a la página anterior de ofertas.
 */
function previousPage() {
  if (firstPage.value) return

  currentPage.value--
  loadOfferProducts()
}

/**
 * Cambia a la página siguiente de ofertas.
 */
function nextPage() {
  if (lastPage.value) return

  currentPage.value++
  loadOfferProducts()
}

/**
 * Cambia la cantidad de ofertas cargadas por página.
 */
function changePageSize() {
  currentPage.value = 0
  loadOfferProducts()
}

onMounted(() => {
  loadOfferProducts()
  loadWishlist()
})
</script>

<template>
  <main class="offers-page">
    <section class="offers-header">
      <h1 class="offers-kicker">Ofertas especiales</h1>
      <p>Descubre promociones especiales en figuras Funko Pop seleccionadas.</p>
    </section>
    <section class="offers-content">
      <div class="offers-top">
        <p v-if="loading">Cargando ofertas...</p>
        <p v-else>Mostrando <strong>{{ offerProducts.length }}</strong> ofertas de <strong>{{ totalElements }}</strong></p>
        <RouterLink to="/catalogo" class="offers-catalog-link">Ver todo el catálogo</RouterLink>
      </div>
      <div class="offers-page-size">
        <label>
          <span>Ofertas por página</span>
          <select v-model="pageSize" @change="changePageSize">
            <option :value="8">8 ofertas</option>
            <option :value="12">12 ofertas</option>
            <option :value="20">20 ofertas</option>
          </select>
        </label>
      </div>
      <div v-if="errorMessage" class="empty-products">
        <h2>{{ errorMessage }}</h2>
        <p>Comprueba que el backend esté iniciado correctamente.</p>
      </div>
      <div v-else-if="offerProducts.length > 0" class="offers-grid">
        <article v-for="product in offerProducts" :key="product.idProducto" class="offer-card">
          <div class="offer-image-wrap">
            <RouterLink :to="`/producto/${product.idProducto}`" class="offer-image-link">
              <img v-if="getProductImage(product.Image)" :src="getProductImage(product.Image)" :alt="product.Nombre" class="offer-image" />
              <div v-else class="offer-image-placeholder">Sin imagen</div>
            </RouterLink>
            <span v-if="isOfertaActiva(product)" class="offer-discount">-{{ product.Descuento }}%</span>
            <button class="wishlist-button" type="button" @click="toggleWishlist(product)">
              <Heart :size="18" :stroke-width="2.4" :fill="isInWishlist(product.idProducto) ? '#f888b4' : 'none'" />
            </button>
          </div>
          <div class="offer-info">
            <p class="offer-category">{{ product.NombreCategoria }}</p>
            <RouterLink :to="`/producto/${product.idProducto}`" class="offer-title-link">
              <h2>{{ product.Nombre }}</h2>
            </RouterLink>
            <p class="offer-description">{{ product.Descripcion }}</p>
            <div class="offer-price-row">
              <strong>{{ product.PrecioFinal_ConIVA.toFixed(2) }}€</strong>
              <span v-if="isOfertaActiva(product)">{{ product.PrecioOriginal_ConIVA.toFixed(2) }}€</span>
            </div>
            <div class="offer-meta">
              <span class="product-status" :class="{ 'product-status-disabled': product.Stock === 0 }">
                {{ product.Stock > 0 ? 'Disponible' : 'Agotado' }}
              </span>
              <span class="product-stock">Stock: {{ product.Stock }}</span>
            </div>
            <button class="add-cart-button" type="button" :disabled="product.Stock === 0" @click="addToCart(product)">
              <ShoppingCart :size="17" :stroke-width="2.4" />
              Añadir
            </button>
          </div>
        </article>
      </div>
      <div v-else-if="!loading" class="empty-products">
        <h2>No hay ofertas disponibles</h2>
        <p>Vuelve más tarde para descubrir nuevas promociones.</p>
        <RouterLink to="/catalogo" class="empty-link">Ir al catálogo</RouterLink>
      </div>
      <div v-if="!loading && !errorMessage && totalPages > 1" class="offers-pagination">
        <button type="button" :disabled="firstPage" @click="previousPage">Anterior</button>
        <span>Página {{ currentPage + 1 }} de {{ totalPages }}</span>
        <button type="button" :disabled="lastPage" @click="nextPage">Siguiente</button>
      </div>
    </section>
  </main>
</template>
<style scoped></style>