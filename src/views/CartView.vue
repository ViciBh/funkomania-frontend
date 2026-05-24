<script setup>
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
          <div class="cart-item-image-wrap">
            <img v-if="getProductImage(product.Image)" :src="getProductImage(product.Image)" :alt="product.Nombre" class="cart-item-image" />
            <div v-else class="cart-item-image-placeholder">Sin imagen</div>
          </div>
          <div class="cart-item-info">
            <h2>{{ product.Nombre }}</h2>
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
        <button class="cart-checkout-button" type="button">Finalizar compra</button>
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