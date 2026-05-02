<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { ShoppingCart, User, Menu, X, Heart } from 'lucide-vue-next'
import { cartCount } from '@/composables/useCart'

const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="page">
    <header class="site-header">
      <div class="header-inner">
        <RouterLink to="/" class="logo" @click="closeMobileMenu">
          <img src="./assets/Logo.svg" class="logo-img" />
        </RouterLink>

        <nav class="main-nav">
          <RouterLink to="/" @click="closeMobileMenu">Inicio</RouterLink>
          <RouterLink to="/catalogo" @click="closeMobileMenu">Catálogo</RouterLink>
          <RouterLink to="/categorias" @click="closeMobileMenu">Categorías</RouterLink>
          <RouterLink to="/ofertas" @click="closeMobileMenu">Ofertas</RouterLink>
        </nav>

        <div class="header-actions">
          <RouterLink to="/login" @click="closeMobileMenu">
            <User :size="27" />
            Iniciar sesión
          </RouterLink>

          <RouterLink to="/lista-deseos" @click="closeMobileMenu">
            <Heart :size="21" />
          </RouterLink>

          <RouterLink to="/carrito" class="cart-link" @click="closeMobileMenu">
            <ShoppingCart :size="22" />
            
            <!-- 🔥 contador dinámico -->
            <span v-if="cartCount > 0" class="cart-count">
              {{ cartCount }}
            </span>
          </RouterLink>

          <button @click="toggleMobileMenu">
            <X v-if="isMobileMenuOpen" />
            <Menu v-else />
          </button>
        </div>
      </div>
    </header>

    <RouterView />
  </div>
</template>