<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ShoppingCart, Heart } from 'lucide-vue-next'
import { products, getPrecioConDescuento, getPrecioConIva } from '@/data/products'
import { addToCart } from '@/composables/useCart'

const offerProducts = computed(() => {
  return products.filter(
    (product) =>
      product.Activo === 1 &&
      product.EnOferta === 1 &&
      product.Descuento > 0
  )
})

function getProductFinalPrice(product) {
  return getPrecioConIva(getPrecioConDescuento(product), product.iva)
}

function getProductOriginalPrice(product) {
  return getPrecioConIva(product.Precio, product.iva)
}
</script>

<template>
  <main class="offers-page">
    <section class="offers-header">
      <h1 class="offers-kicker">Ofertas especiales</h1>
      <p>Descubre promociones especiales en figuras Funko Pop seleccionadas.</p>
    </section>

    <section class="offers-content">
      <div class="offers-top">
        <p>
          Mostrando <strong>{{ offerProducts.length }}</strong> ofertas disponibles
        </p>

        <RouterLink to="/catalogo" class="offers-catalog-link">
          Ver todo el catálogo
        </RouterLink>
      </div>

      <div v-if="offerProducts.length > 0" class="offers-grid">
        <article
          v-for="product in offerProducts"
          :key="product.idProducto"
          class="offer-card"
        >
          <div class="offer-image-wrap">
            <img :src="product.Image" :alt="product.Nombre" class="offer-image" />

            <span class="offer-discount">-{{ product.Descuento }}%</span>

            <button class="wishlist-button" type="button" aria-label="Favoritos">
              <Heart :size="18" :stroke-width="2.4" />
            </button>
          </div>

          <div class="offer-info">
            <p class="offer-category">{{ product.NombreCategoria }}</p>
            <h2>{{ product.Nombre }}</h2>
            <p class="offer-description">{{ product.Descripcion }}</p>

            <div class="offer-price-row">
              <strong>{{ getProductFinalPrice(product).toFixed(2) }}€</strong>
              <span>{{ getProductOriginalPrice(product).toFixed(2) }}€</span>
            </div>

            <div class="offer-meta">
              <span
                class="product-status"
                :class="{ 'product-status-disabled': product.Stock === 0 }"
              >
                {{ product.Stock > 0 ? 'Disponible' : 'Agotado' }}
              </span>

              <span class="product-stock">Stock: {{ product.Stock }}</span>
            </div>

            <button
              class="add-cart-button"
              type="button"
              :disabled="product.Stock === 0"
              @click="addToCart(product)"
            >
              <ShoppingCart :size="17" :stroke-width="2.4" />
              Añadir
            </button>
          </div>
        </article>
      </div>

      <div v-else class="empty-products">
        <h2>No hay ofertas disponibles</h2>
        <p>Vuelve más tarde para descubrir nuevas promociones.</p>
        <RouterLink to="/catalogo" class="empty-link">
          Ir al catálogo
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped></style>