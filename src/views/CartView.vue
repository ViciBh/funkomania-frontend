/**
 * Vista del carrito de compra de Funkomanía.
 * Permite revisar los productos añadidos, modificar cantidades, eliminar productos y consultar el total del pedido.
 *
 * @author Viktoriia Bohoslavska
 * @author IVAN RODRIGUEZ LOREDO
 */
<script setup>
import { RouterLink } from 'vue-router'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-vue-next'
import { getCart, increaseQuantity, decreaseQuantity, removeProductFromCart, clearCart, cartBaseTotal, cartIvaTotal, cartTotal } from '@/composables/useCart'
import { getProductImage } from '@/data/products'

const cart = getCart()
</script>

<template>
  <main class="cart-page">
    <section class="cart-header">
      <h1 class="cart-kicker">Carrito</h1>
      <p>Comprueba los productos añadidos antes de continuar con el pedido.</p>
    </section>
    <section v-if="cart.length > 0" class="cart-content">
      <div class="cart-list">
        <article v-for="product in cart" :key="product.idProducto" class="cart-item">
          <RouterLink :to="`/producto/${product.idProducto}`" class="cart-item-image-wrap">
            <img v-if="getProductImage(product.Image)" :src="getProductImage(product.Image)" :alt="product.Nombre" class="cart-item-image" />
            <div v-else class="cart-item-image-placeholder">Sin imagen</div>
          </RouterLink>
          <div class="cart-item-info">
            <RouterLink :to="`/producto/${product.idProducto}`" class="cart-item-title-link">
              <h2>{{ product.Nombre }}</h2>
            </RouterLink>
            <p>Precio sin IVA: {{ product.PrecioSinIva.toFixed(2) }}€</p>
            <p>Precio con IVA: {{ product.PrecioConIva.toFixed(2) }}€</p>
            <div class="cart-item-controls">
              <button type="button" @click="decreaseQuantity(product.idProducto)">
                <Minus :size="16" :stroke-width="2.5" />
              </button>
              <span>{{ product.Cantidad }}</span>
              <button type="button" @click="increaseQuantity(product.idProducto)">
                <Plus :size="16" :stroke-width="2.5" />
              </button>
              <button class="cart-item-delete" type="button" @click="removeProductFromCart(product.idProducto)">
                <Trash2 :size="17" :stroke-width="2.4" />
              </button>
            </div>
          </div>
          <div class="cart-item-subtotal">
            <span>Subtotal</span>
            <strong>{{ (product.PrecioConIva * product.Cantidad).toFixed(2) }}€</strong>
          </div>
        </article>
      </div>
      <aside class="cart-summary">
        <h2>Resumen</h2>
        <div class="cart-summary-row">
          <span>Base imponible</span>
          <strong>{{ cartBaseTotal.toFixed(2) }}€</strong>
        </div>
        <div class="cart-summary-row">
          <span>IVA incluido</span>
          <strong>{{ cartIvaTotal.toFixed(2) }}€</strong>
        </div>
        <div class="cart-summary-row">
          <span>Total con IVA</span>
          <strong>{{ cartTotal.toFixed(2) }}€</strong>
        </div>
        <RouterLink to="/checkout" class="cart-checkout-button">Finalizar compra</RouterLink>
        <button class="cart-clear-button" type="button" @click="clearCart">Vaciar carrito</button>
      </aside>
    </section>
    <section v-else class="cart-empty">
      <ShoppingCart :size="48" :stroke-width="2.2" />
      <h2>Tu carrito está vacío</h2>
      <p>Añade productos desde el catálogo para verlos aquí.</p>
    </section>
  </main>
</template>

<style scoped></style>