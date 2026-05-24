<script setup>
import { Heart, ShoppingCart, Trash2 } from 'lucide-vue-next'
import { getWishlist, removeFromWishlist } from '@/composables/useWishlist'
import { addToCart } from '@/composables/useCart'
import { getProductImage, isOfertaActiva } from '@/data/products'

const wishlist = getWishlist()

function removeItem(idProducto) {
  removeFromWishlist(idProducto)
}
</script>

<template>
  <main class="wishlist-page">
    <section class="wishlist-header">
      <h1 class="wishlist-kicker">Lista de deseos</h1>
      <p>Tus productos favoritos</p>
    </section>
    <section class="wishlist-content">
      <div v-if="wishlist.length > 0" class="wishlist-grid">
        <article v-for="product in wishlist" :key="product.idProducto" class="wishlist-card">
          <div class="wishlist-image-wrap">
            <img v-if="getProductImage(product.Image)" :src="getProductImage(product.Image)" :alt="product.Nombre" class="wishlist-image" />
            <div v-else class="wishlist-image-placeholder">Sin imagen</div>
          </div>
          <div class="wishlist-info">
            <p class="wishlist-category">{{ product.NombreCategoria }}</p>
            <h2>{{ product.Nombre }}</h2>
            <p class="wishlist-description">{{ product.Descripcion }}</p>
            <div class="wishlist-price-row">
              <strong>{{ product.PrecioFinal_ConIVA.toFixed(2) }}€</strong>
              <span v-if="isOfertaActiva(product)">{{ product.PrecioOriginal_ConIVA.toFixed(2) }}€</span>
            </div>
            <div class="wishlist-actions">
              <button class="wishlist-action-button wishlist-cart-button" type="button" :disabled="product.Stock === 0" @click="addToCart(product)">
                <ShoppingCart :size="18" :stroke-width="2.4" />
              </button>
              <button class="wishlist-action-button wishlist-delete-icon-button" type="button" @click="removeItem(product.idProducto)">
                <Trash2 :size="18" :stroke-width="2.4" />
              </button>
            </div>
          </div>
        </article>
      </div>
      <div v-else class="wishlist-empty">
        <Heart :size="46" :stroke-width="2.2" />
        <h2>Tu lista de deseos está vacía</h2>
        <p>Añade productos desde el catálogo para guardarlos aquí.</p>
      </div>
    </section>
  </main>
</template>