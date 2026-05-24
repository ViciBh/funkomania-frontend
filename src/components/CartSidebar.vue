<script setup>
import { RouterLink } from 'vue-router'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-vue-next'
import { getCart, increaseQuantity, decreaseQuantity, removeProductFromCart, cartTotal } from '@/composables/useCart'
import { getProductImage } from '@/data/products'

defineProps({
  open: Boolean
})

defineEmits(['close'])
const cart = getCart()
</script>

<template>
  <div v-if="open" class="cart-sidebar-overlay" @click="$emit('close')">
    <aside class="cart-sidebar" @click.stop>
      <div class="cart-sidebar-header">
        <h2>Carrito</h2>
        <button class="cart-sidebar-close" type="button" @click="$emit('close')">
          <X :size="22" :stroke-width="2.5" />
        </button>
      </div>
      <div v-if="cart.length > 0" class="cart-sidebar-list">
        <article v-for="product in cart" :key="product.idProducto" class="cart-sidebar-item">
          <div class="cart-sidebar-image-wrap">
            <img v-if="getProductImage(product.Image)" :src="getProductImage(product.Image)" :alt="product.Nombre" class="cart-sidebar-image" />
            <div v-else class="cart-sidebar-image-placeholder">Sin imagen</div>
          </div>
          <div class="cart-sidebar-info">
            <h3>{{ product.Nombre }}</h3>
            <p>{{ product.PrecioConIva.toFixed(2) }}€</p>
            <div class="cart-sidebar-controls">
              <button type="button" @click="decreaseQuantity(product.idProducto)">
                <Minus :size="15" :stroke-width="2.5" />
              </button>
              <span>{{ product.Cantidad }}</span>
              <button type="button" @click="increaseQuantity(product.idProducto)">
                <Plus :size="15" :stroke-width="2.5" />
              </button>
              <button class="cart-sidebar-delete" type="button" @click="removeProductFromCart(product.idProducto)">
                <Trash2 :size="16" :stroke-width="2.4" />
              </button>
            </div>
          </div>
        </article>
      </div>
      <div v-else class="cart-sidebar-empty">
        <ShoppingBag :size="42" :stroke-width="2.2" />
        <h3>Tu carrito está vacío</h3>
        <p>Añade productos desde el catálogo.</p>
      </div>
      <div class="cart-sidebar-footer">
        <div class="cart-sidebar-total">
          <span>Total</span>
          <strong>{{ cartTotal.toFixed(2) }}€</strong>
        </div>
        <RouterLink to="/carrito" class="cart-sidebar-buy" @click="$emit('close')">Comprar</RouterLink>
      </div>
    </aside>
  </div>
</template>