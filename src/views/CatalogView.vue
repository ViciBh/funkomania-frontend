<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Search, ShoppingCart, Heart, SlidersHorizontal } from 'lucide-vue-next'
import { products, categories, isOfertaActiva, productMatchesCategory, getProductImage, getCategoryPathText } from '@/data/products'
import { addToCart } from '@/composables/useCart'
import { toggleWishlist, isInWishlist } from '@/composables/useWishlist'

const search = ref('')
const selectedSort = ref('default')
const selectedPrice = ref('all')
const selectedCategories = ref([])
const route = useRoute()

watch(
  () => route.query.categoria,
  (category) => {
    selectedCategories.value = category ? [category] : []
  },
  { immediate: true }
)

const activeProducts = computed(() => {
  return products.filter((product) => product.Activo === 1)
})

const categoryOptions = computed(() => {
  return categories
})

const filteredProducts = computed(() => {
  const searchText = search.value.trim().toLowerCase()
  const filtered = activeProducts.value.filter((product) => {
    const matchesSearch =
      product.Nombre.toLowerCase().includes(searchText) ||
      product.NombreCategoria.toLowerCase().includes(searchText) ||
      (product.NombreCategoriaPadre || '').toLowerCase().includes(searchText) ||
      getCategoryPathText(product.idCategoria).toLowerCase().includes(searchText)
    // Filtra también por categorías padre usando la función auxiliar
    const matchesCategory = selectedCategories.value.length === 0 ||
      selectedCategories.value.some((category) => productMatchesCategory(product, category))

    const matchesPrice =
      selectedPrice.value === 'all' ||
      (selectedPrice.value === 'low' && product.PrecioFinal_ConIVA < 15) ||
      (selectedPrice.value === 'medium' && product.PrecioFinal_ConIVA >= 15 && product.PrecioFinal_ConIVA <= 25) ||
      (selectedPrice.value === 'high' && product.PrecioFinal_ConIVA > 25)

    return matchesSearch && matchesCategory && matchesPrice
  })

  return filtered.sort((a, b) => {
    if (selectedSort.value === 'price-asc') return a.PrecioFinal_ConIVA - b.PrecioFinal_ConIVA
    if (selectedSort.value === 'price-desc') return b.PrecioFinal_ConIVA - a.PrecioFinal_ConIVA
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
</script>

<template>
  <main class="catalog-page">
    <section class="catalog-title">
      <h1 class="catalog-kicker">Artículos</h1>
      <p>Explora todos los productos disponibles en Funkomanía.</p>
    </section>
    <section class="catalog-search-bar">
      <Search :size="18" :stroke-width="2.4" />
      <input v-model="search" type="search" placeholder="Barra de búsqueda" />
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
          <label v-for="category in categoryOptions" :key="category.idCategoria" class="filter-checkbox">
            <input v-model="selectedCategories" type="checkbox" :value="category.Nombre" />
            <span>{{ category.Nombre }}</span>
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
              <img v-if="getProductImage(product.Image)" :src="getProductImage(product.Image)" :alt="product.Nombre" class="product-image" />
              <div v-else class="product-image-placeholder">Sin imagen</div>
              <div class="product-badges">
                <span v-if="isOfertaActiva(product)" class="product-badge product-badge-offer">-{{ product.Descuento }}%</span>
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
                <strong>{{ product.PrecioFinal_ConIVA.toFixed(2) }}€</strong>
                <span v-if="isOfertaActiva(product)" class="old-price">{{ product.PrecioOriginal_ConIVA.toFixed(2) }}€</span>
              </div>
              <div class="product-meta">
                <span class="product-status" :class="{ 'product-status-disabled': product.Stock === 0 }">
                  {{ product.Stock > 0 ? 'Disponible' : 'Agotado' }}
                </span>
                <span class="product-stock">Stock: {{ product.Stock }}</span>
              </div>
              <!-- botón para añadir al carrito -->
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