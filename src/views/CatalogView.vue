<script setup>
import { computed, ref } from 'vue'
import { Search, ShoppingCart, Heart, SlidersHorizontal } from 'lucide-vue-next'
import { products, getPrecioConDescuento, getPrecioConIva } from '@/data/products'
import { addToCart } from '@/composables/useCart'
import { toggleWishlist, isInWishlist } from '@/composables/useWishlist'

const search = ref('')
const selectedSort = ref('default')
const selectedPrice = ref('all')
const selectedCategories = ref([])

const activeProducts = computed(() => {
  return products.filter((product) => product.Activo === 1)
})

const categories = computed(() => {
  return [...new Set(activeProducts.value.map((product) => product.NombreCategoria))]
})

const filteredProducts = computed(() => {
  const searchText = search.value.trim().toLowerCase()

  const filtered = activeProducts.value.filter((product) => {
    const finalPriceWithoutIva = getPrecioConDescuento(product)
    const finalPriceWithIva = getPrecioConIva(finalPriceWithoutIva, product.iva)

    const matchesSearch =
      product.Nombre.toLowerCase().includes(searchText) ||
      product.NombreCategoria.toLowerCase().includes(searchText) ||
      (product.NombreCategoriaPadre || '').toLowerCase().includes(searchText)

    const matchesCategory = selectedCategories.value.length === 0 || selectedCategories.value.includes(product.NombreCategoria)

    const matchesPrice =
      selectedPrice.value === 'all' ||
      (selectedPrice.value === 'low' && finalPriceWithIva < 15) ||
      (selectedPrice.value === 'medium' && finalPriceWithIva >= 15 && finalPriceWithIva <= 25) ||
      (selectedPrice.value === 'high' && finalPriceWithIva > 25)

    return matchesSearch && matchesCategory && matchesPrice
  })

  return filtered.sort((a, b) => {
    const priceA = getProductFinalPrice(a)
    const priceB = getProductFinalPrice(b)

    if (selectedSort.value === 'price-asc') return priceA - priceB
    if (selectedSort.value === 'price-desc') return priceB - priceA
    if (selectedSort.value === 'name-asc') return a.Nombre.localeCompare(b.Nombre)

    return 0
  })
})

function resetFilters() {
  search.value = ''
  selectedSort.value = 'default'
  selectedPrice.value = 'all'
  selectedCategories.value = []
}

function getProductFinalPrice(product) {
  return getPrecioConIva(getPrecioConDescuento(product), product.iva)
}

function getProductOriginalPrice(product) {
  return getPrecioConIva(product.Precio, product.iva)
}
</script>
<template>

  <main class="catalog-page">
    <section class="catalog-title">
      <h1>Artículos</h1>
      <p>Explora todos los productos disponibles en Funkomanía.</p>
    </section>

    <section class="catalog-search-bar">
      <Search :size="18" :stroke-width="2.4" />
      <input v-model="search" type="search" placeholder="Barra de búsqueda"/>
    </section>

    <section class="catalog-layout">
      <aside class="filters-panel">
        <div class="filters-title">
          <SlidersHorizontal :size="18" :stroke-width="2.4" />
          <h2>Filtros</h2>
        </div>

        <label class="filter-field">
          <span>Ordenar</span>
          <select v-model="selectedSort">
            <option value="default">Por defecto</option>
            <option value="price-asc">Precio menor</option>
            <option value="price-desc">Precio mayor</option>
            <option value="name-asc">Nombre A-Z</option>
          </select>
        </label>

        <label class="filter-field">
          <span>Precios</span>
          <select v-model="selectedPrice">
            <option value="all">Todos</option>
            <option value="low">Menos de 15€</option>
            <option value="medium">15€ - 25€</option>
            <option value="high">Más de 25€</option>
          </select>
        </label>

        <div class="filter-categories">
          <h3>Categorías</h3>

          <label v-for="category in categories" :key="category" class="filter-checkbox">
            <input v-model="selectedCategories" type="checkbox" :value="category" />
            <span>{{ category }}</span>
          </label>
        </div>

        <button class="reset-filters" type="button" @click="resetFilters">Limpiar</button>
      </aside>

      <section class="catalog-content">
        <div class="catalog-content-header">
          <p>Mostrando <strong>{{ filteredProducts.length }}</strong> productos</p>
        </div>

        <div v-if="filteredProducts.length > 0" class="products-grid">
          <article v-for="product in filteredProducts" :key="product.idProducto" class="product-card">
            <div class="product-image-wrap">
              <img :src="product.Image" :alt="product.Nombre" class="product-image"/>

              <div class="product-badges">
                <span v-if="product.EnOferta === 1" class="product-badge product-badge-offer">-{{ product.Descuento }}%</span>
                <span v-if="product.Stock === 0" class="product-badge product-badge-disabled">Agotado</span>
              </div>

              <button class="wishlist-button" type="button" @click="toggleWishlist(product)">
                <Heart :size="18" :stroke-width="2.4" :fill="isInWishlist(product.idProducto) ? '#f888b4' : 'none'" />
              </button>
            </div>

            <div class="product-info">
              <p class="product-category">{{ product.NombreCategoria }}</p>
              <h2>{{ product.Nombre }}</h2>
              <p class="product-saga">{{ product.NombreCategoriaPadre || 'Colección principal' }}</p>

              <div class="product-price-row">
                <strong>{{ getProductFinalPrice(product).toFixed(2) }}€</strong>
                <span v-if="product.EnOferta === 1" class="old-price">{{ getProductOriginalPrice(product).toFixed(2) }}€</span>
              </div>

              <div class="product-meta">
                <span class="product-status" :class="{ 'product-status-disabled': product.Stock === 0 }">
                  {{ product.Stock > 0 ? 'Disponible' : 'Agotado' }}
                </span>
                <span class="product-stock">Stock: {{ product.Stock }}</span>
              </div>
              <!-- Cambio al botón para añadir al carro -->
              <button class="add-cart-button" type="button" :disabled="product.Stock === 0" @click="addToCart(product)">
                <ShoppingCart :size="17" :stroke-width="2.4" />
                Añadir
              </button>
            </div>
          </article>
        </div>

        <div v-else class="empty-products">
          <h2>No se encontraron productos</h2>
          <p>Prueba con otra búsqueda o limpia los filtros.</p>
          <button class="reset-filters" type="button" @click="resetFilters">Limpiar filtros</button>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped></style>