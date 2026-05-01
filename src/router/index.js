import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import CatalogView from '../views/CatalogView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import OffersView from '../views/OffersView.vue'
import LoginView from '../views/LoginView.vue'
import CartView from '../views/CartView.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router