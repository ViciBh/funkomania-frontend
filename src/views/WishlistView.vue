<script setup>
import { Heart, ShoppingCart, Trash2 } from 'lucide-vue-next'
import { getWishlist, removeFromWishlist } from '@/composables/useWishlist'
import { addToCart } from '@/composables/useCart'
import { getPrecioConDescuento, getPrecioConIva, getProductImage, isOfertaActiva } from '@/data/products'

const wishlist = getWishlist()

function getProductFinalPrice(product) {
  return getPrecioConIva(getPrecioConDescuento(product), product.iva)
}

function removeItem(idProducto) {
  removeFromWishlist(idProducto)
}
</script>

<template>
  <main class="wishlist-page">
    <section class="wishlist-header">
      <div class="wishlist-icon"><Heart :size="34" :stroke-width="2.5" /></div>
      <p class="wishlist-kicker">Lista de deseos</p>
      <h1>Tus productos favoritos</h1>
    </section>

    <section class="wishlist-content">
      <div v-if="wishlist.length > 0" class="wishlist-grid">
        <article v-for="product in wishlist" :key="product.idProducto" class="wishlist-card">
          <div class="wishlist-image-wrap">
            <img v-if="getProductImage(product.Image)" :src="getProductImage(product.Image)" :alt="product.Nombre" class="wishlist-image" />
            <div v-else class="wishlist-image-placeholder">Sin imagen</div>
            <button class="wishlist-remove-icon" type="button" @click="removeItem(product.idProducto)">
              <Trash2 :size="18" :stroke-width="2.4" />
            </button>
          </div>
          <div class="wishlist-info">
            <p class="wishlist-category">{{ product.NombreCategoria }}</p>
            <h2>{{ product.Nombre }}</h2>
            <p class="wishlist-description">{{ product.Descripcion }}</p>
            <div class="wishlist-price-row">
              <strong>{{ getProductFinalPrice(product) }}€</strong>
              <span v-if="isOfertaActiva(product)">{{ getPrecioConIva(product.Precio, product.iva) }}€</span>
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