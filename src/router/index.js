import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import CatalogView from '../views/CatalogView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import OffersView from '../views/OffersView.vue'
import LoginView from '../views/LoginView.vue'
import CartView from '../views/CartView.vue'
import RegisterView from '../views/RegisterView.vue'
import WishlistView from '../views/WishlistView.vue'
import ProductView from '@/views/ProductView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import AdminView from '../views/AdminView.vue'
import AccountDataView from '@/views/AccountDataView.vue'
import AccountOrdersView from '@/views/AccountOrdersView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/catalogo',
    name: 'catalog',
    component: CatalogView
  },
  {
    path: '/categorias',
    name: 'categories',
    component: CategoriesView
  },
  {
    path: '/ofertas',
    name: 'offers',
    component: OffersView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/carrito',
    name: 'cart',
    component: CartView
  },
  {
    path: '/registro',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/lista-deseos',
    name: 'wishlist',
    component: WishlistView
  },
  {
    path: '/producto/:id',
    name: 'product',
    component: ProductView
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView
  },
  {
    path: '/cuenta-datos',
    component: AccountDataView
  },
  {
    path: '/cuenta-pedidos',
    component: AccountOrdersView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router