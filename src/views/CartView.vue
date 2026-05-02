<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCart, removeFromCart, cartCount } from '@/composables/useCart'


onMounted(() => {
  cart.value = JSON.parse(localStorage.getItem('cart')) || []
})

const cart= getCart()

const total = computed(() =>
  cart.value.reduce((sum, p) => sum + Number(p.Precio || 0), 0)
)

function removeItem(index) {
  removeFromCart(index)
}

function handleAdd(product){
  addToCart(product)
}
</script>

<template>
  <main class="catalog-page">
    
    <section class="catalog-title">
      <h1>Carrito</h1>
      <p>Productos añadidos a tu compra</p>
    </section>

    <section class="catalog-content">

      <div v-if="cart.length > 0" class="products-grid">

        <article v-for="(product, index) in cart" :key="index" class="product-card">

          <div class="product-image-wrap">
            <img :src="product.Image" class="product-image" />
          </div>

          <div class="product-info">
            <h2>{{ product.Nombre }}</h2>

            <div class="product-price-row">
              <strong>{{ product.Precio }}€</strong>
            </div>

            <button class="add-cart-button" @click="removeItem(index)">
              Eliminar
            </button>
          </div>

        </article>

      </div>

      <div v-else class="empty-products">
        <h2>Tu carrito está vacío</h2>
        <p>Añade productos desde el catálogo</p>
      </div>

      <div v-if="cart.length > 0" style="margin-top:20px; text-align:right;">
        <h2>Total: {{ total }}€</h2>
      </div>

    </section>
  </main>
</template>