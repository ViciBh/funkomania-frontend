/**
 * Vista de detalle de producto de Funkomanía.
 * Muestra la información completa de un producto seleccionado y sus acciones principales.
 *
 * @author Viktoriia Bohoslavska
 */
<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-vue-next'
import { getProductById } from '@/services/productService'
import { addToCart } from '@/composables/useCart'
import { toggleWishlist, isInWishlist, loadWishlist } from '@/composables/useWishlist'

const route = useRoute()
const product = ref(null)
const loading = ref(false)
const errorMessage = ref('')
/**
 * Carga el detalle de un producto desde la API backend.
 */
async function loadProduct() {
  loading.value = true
  errorMessage.value = ''
  product.value = null
  try {
    product.value = await getProductById(route.params.id)
  } catch (error) {
    errorMessage.value = 'No se pudo cargar el producto'
    console.error('Error cargando producto:', error)
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

onMounted(() => {
  loadProduct()
  loadWishlist()
})

watch(
  () => route.params.id,
  () => {
    loadProduct()
  }
)
</script>

<template>
  <main class="product-detail-page">
    <section v-if="loading" class="product-detail-empty">
      <h1>Cargando producto...</h1>
    </section>
    <section v-else-if="product" class="product-detail-container">
      <RouterLink to="/catalogo" class="product-back-link">
        <ArrowLeft :size="18" :stroke-width="2.5" />
        Volver al catálogo
      </RouterLink>
      <section class="product-detail-layout">
        <div class="product-detail-image-wrap">
          <img v-if="getProductImage(product.Image)" :src="getProductImage(product.Image)" :alt="product.Nombre" class="product-detail-image" />
          <div v-else class="product-detail-image-placeholder">Sin imagen</div>
          <button class="product-detail-wishlist" type="button" @click="toggleWishlist(product)">
            <Heart :size="22" :stroke-width="2.4" :fill="isInWishlist(product.idProducto) ? '#f888b4' : 'none'" />
          </button>
        </div>
        <article class="product-detail-info">
          <div class="product-detail-top">
            <div>
              <p class="product-detail-category">{{ product.NombreCategoria }}</p>
              <h1>{{ product.Nombre }}</h1>
              <p class="product-detail-saga">{{ product.NombreCategoriaPadre || 'Colección principal' }}</p>
            </div>
            <div class="product-detail-price">
              <strong>{{ product.PrecioFinal_ConIVA.toFixed(2) }}€</strong>
              <span v-if="isOfertaActiva(product)">{{ product.PrecioOriginal_ConIVA.toFixed(2) }}€</span>
            </div>
          </div>
          <div class="product-detail-stock">
            <span class="product-status" :class="{ 'product-status-disabled': product.Stock === 0 }">
              {{ product.Stock > 0 ? 'Disponible' : 'Agotado' }}
            </span>
            <span>Stock: {{ product.Stock }}</span>
          </div>
          <div class="product-detail-actions">
            <button class="add-cart-button" type="button" :disabled="product.Stock === 0" @click="addToCart(product)">
              <ShoppingCart :size="17" :stroke-width="2.4" />
              Añadir carrito
            </button>
            <RouterLink to="/carrito" class="product-buy-button">Comprar</RouterLink>
          </div>
          <section class="product-detail-description">
            <h2>Descripción</h2>
            <p>{{ product.Descripcion }}</p>
          </section>
        </article>
      </section>
    </section>
    <section v-else class="product-detail-empty">
      <h1>{{ errorMessage || 'Producto no encontrado' }}</h1>
      <p>El artículo seleccionado no existe o ya no está disponible.</p>
      <RouterLink to="/catalogo" class="product-buy-button">Volver al catálogo</RouterLink>
    </section>
  </main>
</template>

<style scoped></style>