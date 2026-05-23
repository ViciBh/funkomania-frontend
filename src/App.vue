<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { ShoppingCart, User, Menu, X, Heart } from 'lucide-vue-next'
import { cartCount } from '@/composables/useCart'
import CartSidebar from '@/components/CartSidebar.vue'

const isMobileMenuOpen = ref(false)
const isCartOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function openCart() {
  isCartOpen.value = true
  closeMobileMenu()
}

function closeCart() {
  isCartOpen.value = false
}
</script>

<template>
  <div class="page">
    <header class="site-header">
      <div class="header-inner">
        <RouterLink to="/" class="logo" @click="closeMobileMenu">
          <img src="./assets/Logo.svg" alt="Funkomania" class="logo-img" />
        </RouterLink>

        <nav class="main-nav">
          <RouterLink to="/" @click="closeMobileMenu">Inicio</RouterLink>
          <RouterLink to="/catalogo" @click="closeMobileMenu">Catálogo</RouterLink>
          <RouterLink to="/categorias" @click="closeMobileMenu">Categorías</RouterLink>
          <RouterLink to="/ofertas" @click="closeMobileMenu">Ofertas</RouterLink>
        </nav>

        <div class="header-actions">
          <RouterLink to="/login" class="login-link" @click="closeMobileMenu">
            <User class="login-icon" :size="27" :stroke-width="2.4" />
            <span class="login-text">Iniciar sesión</span>
          </RouterLink>

          <RouterLink to="/lista-deseos" class="wishlist-link" @click="closeMobileMenu">
            <Heart class="wishlist-header-icon" :size="21" :stroke-width="2.4"/>
          </RouterLink>

          <button class="cart-link" type="button" @click="openCart">
            <ShoppingCart class="cart-icon" :size="22" :stroke-width="2.4"/>
            <!-- contador dinámico -->
            <span v-if="cartCount > 0" class="cart-count">
              {{ cartCount }}
            </span>
          </button>

          <button class="burger-button" type="button" @click="toggleMobileMenu">
            <X v-if="isMobileMenuOpen" :size="24" :stroke-width="2.5" />
            <Menu v-else :size="24" :stroke-width="2.5" />
          </button>
        </div>
      </div>
      <nav class="mobile-nav" :class="{ 'mobile-nav-open': isMobileMenuOpen }">
        <RouterLink to="/" @click="closeMobileMenu">Inicio</RouterLink>
        <RouterLink to="/catalogo" @click="closeMobileMenu">Catálogo</RouterLink>
        <RouterLink to="/categorias" @click="closeMobileMenu">Categorías</RouterLink>
        <RouterLink to="/ofertas" @click="closeMobileMenu">Ofertas</RouterLink>
        <RouterLink to="/lista-deseos" @click="closeMobileMenu">Lista de deseos</RouterLink>
      </nav>
    </header>
    <RouterView />

    <footer class="site-footer">
      <div class="footer-inner">
        <p class="footer-brand">© 2026 Funkomanía</p>
        <nav class="footer-nav">
          <RouterLink to="/sobre-nosotros">Sobre nosotros</RouterLink>
          <RouterLink to="/contacto">Contacto</RouterLink>
          <RouterLink to="/terminos">Términos</RouterLink>
        </nav>
      </div>
    </footer>
    <CartSidebar :open="isCartOpen" @close="closeCart" />
  </div>
</template>