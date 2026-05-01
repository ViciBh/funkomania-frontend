<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ShoppingCart, User, BadgePercent, ShoppingBag, Sparkles, Menu, X} from 'lucide-vue-next'

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
        <RouterLink to="/" class="logo" aria-label="Funkomania inicio" @click="closeMobileMenu">
          <img src="../assets/Logo.svg" alt="Funkomania" class="logo-img" />
        </RouterLink>

        <nav class="main-nav" aria-label="Navegación principal">
          <RouterLink to="/">Inicio</RouterLink>
          <RouterLink to="/catalogo">Catálogo</RouterLink>
          <RouterLink to="/categorias">Categorías</RouterLink>
          <RouterLink to="/ofertas">Ofertas</RouterLink>
        </nav>

        <div class="header-actions">
          <RouterLink to="/login" class="login-link">
            <User class="login-icon" :size="27" :stroke-width="2.4" />
            <span class="login-text">Iniciar sesión</span>
          </RouterLink>

          <RouterLink to="/carrito" class="cart-link" aria-label="Carrito">
            <ShoppingCart class="cart-icon" :size="22" :stroke-width="2.4" />
            <span class="cart-count">0</span>
          </RouterLink>

          <button class="burger-button" type="button"
            :aria-label="isMobileMenuOpen ? 'Cerrar' : 'Abrir'" :aria-expanded="isMobileMenuOpen" @click="toggleMobileMenu">
            <X v-if="isMobileMenuOpen" :size="24" :stroke-width="2.5" />
            <Menu v-else :size="24" :stroke-width="2.5" />
          </button>
        </div>
      </div>

      <nav class="mobile-nav" :class="{ 'mobile-nav-open': isMobileMenuOpen }" aria-label="Navegación móvil">
        <RouterLink to="/" @click="closeMobileMenu">Inicio</RouterLink>
        <RouterLink to="/catalogo" @click="closeMobileMenu">Catálogo</RouterLink>
        <RouterLink to="/categorias" @click="closeMobileMenu">Categorías</RouterLink>
        <RouterLink to="/ofertas" @click="closeMobileMenu">Ofertas</RouterLink>
      </nav>
    </header>

    <main class="main">
      <section class="container">
        <section class="page-title">
          <img src="../assets/funkomania.png" alt="Funkomanía" class="page-title-img" />
        </section>

        <p class="slogan">Figuras Funko Pop para fans de la cultura geek</p>

        <section class="home-sections" aria-label="Sección principal">
          <RouterLink to="/ofertas" class="home-card home-card-offers">
            <span class="card-icon"><BadgePercent :size="30" :stroke-width="2.5" /></span>
            <h2>OFERTAS</h2>
            <p>Descuentos y promociones especiales</p>
          </RouterLink>

          <RouterLink to="/catalogo" class="home-card home-card-products">
            <span class="card-icon"><ShoppingBag :size="30" :stroke-width="2.5" /></span>
            <h2>TODOS LOS PRODUCTOS</h2>
            <p>Explora el catálogo completo</p>
          </RouterLink>

          <RouterLink to="/categorias" class="home-card home-card-categories">
            <span class="card-icon"><Sparkles :size="30" :stroke-width="2.5" /></span>
            <h2>CATEGORÍAS</h2>
            <p>Busca por sagas y temáticas</p>
          </RouterLink>
        </section>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <p class="footer-brand">© 2026 Funkomanía</p>
        <nav class="footer-nav" aria-label="Navegación secundaria">
          <RouterLink to="/sobre-nosotros">Sobre nosotros</RouterLink>
          <RouterLink to="/contacto">Contacto</RouterLink>
          <RouterLink to="/terminos">Términos</RouterLink>
        </nav>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>