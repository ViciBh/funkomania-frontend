<script setup>
import { RouterLink } from 'vue-router'
import { ShoppingCart, Heart } from 'lucide-vue-next'
import { productosOfertas, getProductImage } from '@/data/products'
import { addToCart } from '@/composables/useCart'
import { toggleWishlist, isInWishlist } from '@/composables/useWishlist'
</script>

<template>
  <main class="offers-page">
    <section class="offers-header">
      <h1 class="offers-kicker">Ofertas especiales</h1>
      <p>Descubre promociones especiales en figuras Funko Pop seleccionadas.</p>
    </section>
    <section class="offers-content">
      <div class="offers-top">
        <p>Mostrando <strong>{{ productosOfertas.length }}</strong> ofertas disponibles</p>
        <RouterLink to="/catalogo" class="offers-catalog-link">Ver todo el catálogo</RouterLink>
      </div>
      <div v-if="productosOfertas.length > 0" class="offers-grid">
        <article v-for="product in productosOfertas" :key="product.idProducto" class="offer-card">
          <div class="offer-image-wrap">
            <img v-if="getProductImage(product.Image)" :src="getProductImage(product.Image)" :alt="product.Nombre" class="offer-image" />
            <div v-else class="offer-image-placeholder">Sin imagen</div>
            <span class="offer-discount">-{{ product.Descuento }}%</span>
            <button class="wishlist-button" type="button" @click="toggleWishlist(product)">
              <Heart :size="18" :stroke-width="2.4" :fill="isInWishlist(product.idProducto) ? '#f888b4' : 'none'" />
            </button>
          </div>
          <div class="offer-info">
            <p class="offer-category">{{ product.NombreCategoria }}</p>
            <h2>{{ product.Nombre }}</h2>
            <p class="offer-description">{{ product.Descripcion }}</p>
            <div class="offer-price-row">
              <strong>{{ product.PrecioFinal_ConIVA.toFixed(2) }}€</strong>
              <span>{{ product.PrecioOriginal_ConIVA.toFixed(2) }}€</span>
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
      <div v-else class="empty-products">
        <h2>No hay ofertas disponibles</h2>
        <p>Vuelve más tarde para descubrir nuevas promociones.</p>
        <RouterLink to="/catalogo" class="empty-link">Ir al catálogo</RouterLink>
      </div>
    </section>
  </main>
</template>
<style scoped></style>