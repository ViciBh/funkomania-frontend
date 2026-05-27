import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/styles/main.css'
import './assets/styles/home.css'
import './assets/styles/catalog.css'
import './assets/styles/offers.css'
import './assets/styles/categories.css'
import './assets/styles/cart.css'
import './assets/styles/login.css'
import './assets/styles/wishlist.css'
import './assets/styles/cartsidebar.css'
import './assets/styles/product.css'
import './assets/styles/checkout.css'
import './assets/styles/admin.css'

createApp(App)
  .use(router)
  .mount('#app')