/**
 * Componente principal de Funkomanía.
 * Define la estructura general de la aplicación, incluyendo navegación, cabecera, pie de página y vistas dinámicas.
 *
 * @author Viktoriia Bohoslavska
 */
<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ShoppingCart, User, Menu, X, Heart, Bell, LogOut } from 'lucide-vue-next'
import { cartCount } from '@/composables/useCart'
import { useAuth } from '@/composables/useAuth'
import { notifications, notificationsLoading, notificationsError, unreadNotificationsCount, isNotificationUnread, getNotificationStatusText, loadNotifications, readNotification, clearNotifications } from '@/composables/useNotifications'
import CartSidebar from '@/components/CartSidebar.vue'

const route = useRoute()
const router = useRouter()
const isMobileMenuOpen = ref(false)
const isCartOpen = ref(false)
const isNotificationsOpen = ref(false)
const { authUser, isAuthenticated, isAdmin, clearAuthUser, getLoginRedirect } = useAuth()
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})
const homeRoute = computed(() => {
  return isAdmin.value ? '/admin' : '/'
})
const wishlistRoute = computed(() => {
  return isAuthenticated.value ? '/lista-deseos' : getLoginRedirect('/lista-deseos')
})

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function openCart() {
  isCartOpen.value = true
}

function closeCart() {
  isCartOpen.value = false
}

function toggleNotifications() {
  isNotificationsOpen.value = !isNotificationsOpen.value
  if (isNotificationsOpen.value) {
    loadNotifications()
  }
}

function closeNotifications() {
  isNotificationsOpen.value = false
}

async function handleReadNotification(idNotificacion) {
  await readNotification(idNotificacion)
}

function handleLogout() {
  clearAuthUser()
  clearNotifications()
  closeMobileMenu()
  closeCart()
  closeNotifications()
  router.push('/')
}

onMounted(() => {
  if (isAuthenticated.value) {
    loadNotifications()
  }
})

watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    loadNotifications()
  } else {
    clearNotifications()
  }
})
</script>

<template>
  <div class="page">
    <header v-if="!isAdminRoute" class="site-header">
      <div class="header-inner">
        <RouterLink :to="homeRoute" class="logo" @click="closeMobileMenu">
          <img src="./assets/logo.svg" alt="Funkomanía" class="logo-img" />
        </RouterLink>
        <nav class="main-nav">
          <RouterLink :to="homeRoute">Inicio</RouterLink>
          <RouterLink to="/catalogo">Catálogo</RouterLink>
          <RouterLink to="/categorias">Categorías</RouterLink>
          <RouterLink to="/ofertas">Ofertas</RouterLink>
        </nav>
        <div class="header-actions">
          <div v-if="isAuthenticated" class="notification-wrap">
            <button class="wishlist-link notification-button" type="button" title="Notificaciones" @click="toggleNotifications">
              <Bell :size="21" :stroke-width="2.3" />
              <span v-if="unreadNotificationsCount > 0" class="notification-count">{{ unreadNotificationsCount }}</span>
            </button>
            <div v-if="isNotificationsOpen" class="notification-dropdown">
              <div class="notification-dropdown-header">
                <h2>Notificaciones</h2>
                <button type="button" @click="closeNotifications">Cerrar</button>
              </div>
              <p v-if="notificationsLoading" class="notification-empty">Cargando notificaciones...</p>
              <p v-else-if="notificationsError" class="notification-empty">{{ notificationsError }}</p>
              <div v-else-if="notifications.length > 0" class="notification-list">
                <button v-for="notification in notifications" :key="notification.idNotificacion" class="notification-item" :class="{ 'notification-item-unread': isNotificationUnread(notification) }" type="button" @click="handleReadNotification(notification.idNotificacion)">
                  <span class="notification-type">{{ notification.tipoNotificacion }}</span>
                  <strong>{{ notification.mensaje }}</strong>
                  <small>{{ getNotificationStatusText(notification) }}</small>
                </button>
              </div>
              <p v-else class="notification-empty">No tienes notificaciones.</p>
            </div>
          </div>
          <div v-if="isAuthenticated" class="header-user-box">
            <User class="login-icon" :size="21" :stroke-width="2.3" />
            <span class="header-user-data">
              <strong>{{ authUser.name || 'Usuario' }}</strong>
              <small>{{ authUser.username }}</small>
            </span>
            <button class="logout-link" type="button" @click="handleLogout">
              <LogOut :size="18" :stroke-width="2.3" />
              <span>Cerrar sesión</span>
            </button>
          </div>
          <RouterLink v-else to="/login" class="login-link">
            <User class="login-icon" :size="21" :stroke-width="2.3" />
            <span class="login-text">Mi cuenta</span>
          </RouterLink>
          <RouterLink :to="wishlistRoute" class="wishlist-link">
            <Heart class="wishlist-header-icon" :size="21" :stroke-width="2.3" />
          </RouterLink>
          <button class="cart-link" type="button" @click="openCart">
            <ShoppingCart class="cart-icon" :size="22" :stroke-width="2.3" />
            <!-- contador dinámico -->
            <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
          </button>
          <button class="burger-button" type="button" @click="toggleMobileMenu">
            <X v-if="isMobileMenuOpen" :size="25" :stroke-width="2.4" />
            <Menu v-else :size="25" :stroke-width="2.4" />
          </button>
        </div>
      </div>
      <nav class="mobile-nav" :class="{ 'mobile-nav-open': isMobileMenuOpen }">
        <RouterLink :to="homeRoute" @click="closeMobileMenu">Inicio</RouterLink>
        <RouterLink to="/catalogo" @click="closeMobileMenu">Catálogo</RouterLink>
        <RouterLink to="/categorias" @click="closeMobileMenu">Categorías</RouterLink>
        <RouterLink to="/ofertas" @click="closeMobileMenu">Ofertas</RouterLink>
        <RouterLink :to="wishlistRoute" @click="closeMobileMenu">Lista de deseos</RouterLink>
        <div v-if="isAuthenticated" class="mobile-user-box">
          <strong>{{ authUser.name || 'Usuario' }}</strong>
          <small>{{ authUser.username }}</small>
          <button type="button" @click="handleLogout">Cerrar sesión</button>
        </div>
        <RouterLink v-else to="/login" @click="closeMobileMenu">Mi cuenta</RouterLink>
      </nav>
    </header>
    <header v-else class="admin-site-header">
      <div class="admin-header-inner">
        <RouterLink to="/admin" class="admin-header-logo-link">
          <img src="./assets/funkomania.png" alt="Funkomanía" class="admin-header-logo-img" />
        </RouterLink>
        <div class="admin-header-actions">
          <button class="admin-notification-button" type="button">
            <Bell :size="22" :stroke-width="2.4" />
          </button>
          <div class="admin-header-account">
            <div>
              <strong>Cuenta</strong>
              <span>Administrador</span>
            </div>
          </div>
        </div>
      </div>
    </header>
    <RouterView />
    <CartSidebar v-if="!isAdminRoute" :open="isCartOpen" @close="closeCart" />
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
  </div>
</template>