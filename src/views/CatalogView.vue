/**
 * Vista del catálogo de productos de Funkomanía.
 * Permite visualizar productos, buscar, filtrar por categorías y acceder al detalle de cada producto.
 *
 * @author Viktoriia Bohoslavska
 * @author IVAN RODRIGUEZ LOREDO
 */
<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Search, ShoppingCart, Heart, SlidersHorizontal } from 'lucide-vue-next'
import { getProductsList } from '@/services/productService'
import { getCategories } from '@/services/categoryService'
// Funcionalidad de añadir productos al carrito implementada por IVAN RODRIGUEZ LOREDO.
import { addToCart } from '@/composables/useCart'
import { toggleWishlist, isInWishlist } from '@/composables/useWishlist'

const search = ref('')
const selectedSort = ref('default')
const selectedPrice = ref('all')
const selectedCategories = ref([])
const products = ref([])
const categories = ref([])
const loading = ref(false)
const errorMessage = ref('')
const currentPage = ref(0)
const pageSize = ref(20)
const route = useRoute()

watch(
  () => route.query.categoria,
  (category) => {
    selectedCategories.value = category ? [category] : []
    currentPage.value = 0
  },
  { immediate: true }
)

watch([search, selectedPrice, selectedCategories], () => {
  currentPage.value = 0
})

/**
 * Carga los productos y categorías desde la API backend.
 * Los productos se cargan como lista completa para permitir filtros por categorías profundas.
 */
async function loadCatalogData() {
  loading.value = true
  errorMessage.value = ''

  try {
    products.value = await getProductsList()
    categories.value = await getCategories()
  } catch (error) {
    errorMessage.value = 'No se pudo cargar el catálogo'
    console.error('Error cargando catálogo:', error)
  } finally {
    loading.value = false
  }
}

/**
 * Comprueba si una oferta está activa según los datos recibidos del backend.
 */
function isOfertaActiva(product) {
  return product.EnOferta === 1 &&
    product.Descuento > 0 &&
    (!product.FechaFinOferta || new Date(product.FechaFinOferta) >= new Date())
}

/**
 * Devuelve la imagen del producto si existe.
 */
function getProductImage(image) {
  return image || null
}

/**
 * Obtiene una categoría por su identificador.
 */
function getCategoryById(idCategoria) {
  return categories.value.find((category) => category.idCategoria === Number(idCategoria)) || null
}

/**
 * Comprueba si una categoría pertenece a otra categoría padre.
 */
function isCategoryOrChild(productCategoryId, selectedCategoryName) {
  let category = getCategoryById(productCategoryId)

  while (category) {
    if (category.Nombre === selectedCategoryName) return true
    category = category.CategoriaPadre ? getCategoryById(category.CategoriaPadre) : null
  }

  return false
}

/**
 * Comprueba si el producto coincide con la categoría seleccionada.
 */
function productMatchesCategory(product, categoryName) {
  return isCategoryOrChild(product.idCategoria, categoryName)
}

/**
 * Genera la ruta textual de la categoría para usarla en búsqueda.
 */
function getCategoryPathText(idCategoria) {
  const names = []
  let category = getCategoryById(idCategoria)

  while (category) {
    names.unshift(category.Nombre)
    category = category.CategoriaPadre ? getCategoryById(category.CategoriaPadre) : null
  }

  return names.join(' ')
}

const activeProducts = computed(() => {
  return products.value.filter((product) => product.Activo === 1)
})

const categoryOptions = computed(() => {
  return categories.value
})

const filteredProducts = computed(() => {
  const searchText = search.value.trim().toLowerCase()
  const filtered = activeProducts.value.filter((product) => {
    const matchesSearch =
      product.Nombre.toLowerCase().includes(searchText) ||
      product.NombreCategoria.toLowerCase().includes(searchText) ||
      (product.NombreCategoriaPadre || '').toLowerCase().includes(searchText) ||
      getCategoryPathText(product.idCategoria).toLowerCase().includes(searchText)

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

const paginatedProducts = computed(() => {
  const start = currentPage.value * pageSize.value
  const end = start + pageSize.value

  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / pageSize.value)
})

const totalElements = computed(() => {
  return filteredProducts.value.length
})

const firstPage = computed(() => {
  return currentPage.value === 0
})

const lastPage = computed(() => {
  return currentPage.value >= totalPages.value - 1
})

function resetFilters() {
  search.value = ''
  selectedSort.value = 'default'
  selectedPrice.value = 'all'
  selectedCategories.value = []
  currentPage.value = 0
}

/**
 * Cambia a la página anterior del catálogo.
 */
function previousPage() {
  if (firstPage.value) return

  currentPage.value--
}

/**
 * Cambia a la página siguiente del catálogo.
 */
function nextPage() {
  if (lastPage.value) return

  currentPage.value++
}

/**
 * Cambia la cantidad de productos mostrados por página.
 */
function changePageSize() {
  currentPage.value = 0
}

onMounted(() => {
  loadCatalogData()
})
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

        <label class="filter-field">
          <span>Productos por página</span>
          <select v-model="pageSize" @change="changePageSize">
            <option :value="12">12 productos</option>
            <option :value="20">20 productos</option>
            <option :value="50">50 productos</option>
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
          <p v-if="loading">Cargando productos...</p>
          <p v-else>
            Mostrando <strong>{{ paginatedProducts.length }}</strong> productos de <strong>{{ totalElements }}</strong>
          </p>
        </div>
        <div v-if="errorMessage" class="empty-products">
          <h2>{{ errorMessage }}</h2>
          <p>Comprueba que el backend esté iniciado correctamente.</p>
        </div>
        <div v-else-if="paginatedProducts.length > 0" class="products-grid">
          <article v-for="product in paginatedProducts" :key="product.idProducto" class="product-card">
            <div class="product-image-wrap">
              <RouterLink :to="`/producto/${product.idProducto}`" class="product-image-link">
                <img v-if="getProductImage(product.Image)" :src="getProductImage(product.Image)" :alt="product.Nombre" class="product-image" />
                <div v-else class="product-image-placeholder">Sin imagen</div>
              </RouterLink>
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
              <RouterLink :to="`/producto/${product.idProducto}`" class="product-title-link">
                <h2>{{ product.Nombre }}</h2>
              </RouterLink>
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
              <!-- Funcionalidad de añadir productos al carrito implementada por IVAN RODRIGUEZ LOREDO. -->
              <button class="add-cart-button" type="button" :disabled="product.Stock === 0" @click="addToCart(product)">
                <ShoppingCart :size="17" :stroke-width="2.4" />
                Añadir
              </button>
            </div>
          </article>
        </div>

        <div v-else-if="!loading" class="empty-products">
          <h2>No se encontraron productos</h2>
          <p>Prueba con otra búsqueda o limpia los filtros.</p>
          <button class="reset-filters" type="button" @click="resetFilters">Limpiar filtros</button>
        </div>

        <div v-if="!loading && !errorMessage && totalPages > 1" class="catalog-pagination">
          <button type="button" :disabled="firstPage" @click="previousPage">Anterior</button>
          <span>Página {{ currentPage + 1 }} de {{ totalPages }}</span>
          <button type="button" :disabled="lastPage" @click="nextPage">Siguiente</button>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped></style>