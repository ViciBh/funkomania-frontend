/**
 * Vista de categorías de Funkomanía.
 * Muestra la estructura de categorías y subcategorías para facilitar la navegación por el catálogo.
 *
 * @author Viktoriia Bohoslavska
 */
<script setup>
import { computed, ref, onMounted, onBeforeUnmount, defineComponent, h } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronDown, ChevronRight, ArrowRight } from 'lucide-vue-next'
import { getCategories } from '@/services/categoryService'
import { getProductsList } from '@/services/productService'

const openCategories = ref([])
const categoriesPageRef = ref(null)
const categories = ref([])
const products = ref([])
const loading = ref(false)
const errorMessage = ref('')

async function loadCategoriesData() {
  loading.value = true
  errorMessage.value = ''

  try {
    categories.value = await getCategories()
    products.value = await getProductsList()
  } catch (error) {
    errorMessage.value = 'No se pudieron cargar las categorías'
    console.error('Error cargando categorías:', error)
  } finally {
    loading.value = false
  }
}

const activeProducts = computed(() => {
  return products.value.filter((product) => product.Activo === 1)
})

const parentCategories = computed(() => {
  return categories.value.filter((category) => category.CategoriaPadre === null)
})

function getChildren(idCategoria) {
  return categories.value.filter((category) => category.CategoriaPadre === idCategoria)
}

function hasChildren(idCategoria) {
  return getChildren(idCategoria).length > 0
}

function getCategoryById(idCategoria) {
  return categories.value.find((category) => category.idCategoria === Number(idCategoria)) || null
}

function isCategoryOrChild(productCategoryId, selectedCategoryName) {
  let category = getCategoryById(productCategoryId)

  while (category) {
    if (category.Nombre === selectedCategoryName) return true
    category = category.CategoriaPadre ? getCategoryById(category.CategoriaPadre) : null
  }

  return false
}

function getCategoryTotal(categoryName) {
  return activeProducts.value.filter((product) => isCategoryOrChild(product.idCategoria, categoryName)).length
}

function toggleCategory(idCategoria) {
  if (openCategories.value.includes(idCategoria)) {
    openCategories.value = openCategories.value.filter((id) => id !== idCategoria)
  } else {
    openCategories.value.push(idCategoria)
  }
}

function isOpen(idCategoria) {
  return openCategories.value.includes(idCategoria)
}

function closeCategories(event) {
  if (categoriesPageRef.value && !categoriesPageRef.value.contains(event.target)) {
    openCategories.value = []
  }
}

const CategoryNode = defineComponent({
  name: 'CategoryNode',
  props: {
    category: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 1
    }
  },
  setup(props) {
    return () => {
      const children = getChildren(props.category.idCategoria)
      const categoryHasChildren = children.length > 0
      const opened = isOpen(props.category.idCategoria)
      const total = getCategoryTotal(props.category.Nombre)
      const rowClass = props.level === 1 ? 'category-child-row' : 'category-subchild-row'

      const row = categoryHasChildren
        ? h('button', { class: rowClass, type: 'button', onClick: (event) => { event.stopPropagation(); toggleCategory(props.category.idCategoria) } }, [
            h('span', props.category.Nombre),
            h('small', `${total} productos`),
            h(opened ? ChevronDown : ChevronRight, { size: props.level === 1 ? 17 : 15, strokeWidth: 2.5 })
          ])
        : h(RouterLink, { to: { path: '/catalogo', query: { categoria: props.category.Nombre } }, class: rowClass }, {
            default: () => [
              h('span', props.category.Nombre),
              h('small', `${total} productos`),
              h(ArrowRight, { size: props.level === 1 ? 16 : 15, strokeWidth: 2.5 })
            ]
          })

      const childBlock = categoryHasChildren && opened
        ? h('div', { class: 'category-subchildren' }, [
            h(RouterLink, { to: { path: '/catalogo', query: { categoria: props.category.Nombre } }, class: 'category-subchild-row category-subchild-all' }, {
              default: () => [
                `Ver todo ${props.category.Nombre}`,
                h(ArrowRight, { size: 15, strokeWidth: 2.5 })
              ]
            }),
            ...children.map((child) => h(CategoryNode, { key: child.idCategoria, category: child, level: props.level + 1 }))
          ])
        : null

      return h('div', { class: 'category-recursive-node', style: { marginLeft: props.level > 1 ? '14px' : '0' } }, [row, childBlock])
    }
  }
})

onMounted(() => {
  loadCategoriesData()
  document.addEventListener('click', closeCategories)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeCategories)
})
</script>

<template>
  <main class="categories-page" ref="categoriesPageRef">
    <section class="categories-header">
      <h1 class="categories-kicker">Categorías</h1>
    </section>

    <section v-if="loading" class="category-empty">
      <p>Cargando categorías...</p>
    </section>

    <section v-else-if="errorMessage" class="category-empty">
      <p>{{ errorMessage }}</p>
    </section>

    <section v-else class="categories-grid">
      <article v-for="category in parentCategories" :key="category.idCategoria" class="category-card">
        <button class="category-card-main" type="button" @click.stop="toggleCategory(category.idCategoria)">
          <div>
            <span class="category-label">Categoría principal</span>
            <h2>{{ category.Nombre }}</h2>
            <p>{{ getCategoryTotal(category.Nombre) }} productos</p>
          </div>

          <span class="category-arrow">
            <ChevronDown v-if="isOpen(category.idCategoria)" :size="22" :stroke-width="2.5" />
            <ChevronRight v-else :size="22" :stroke-width="2.5" />
          </span>
        </button>

        <div v-if="isOpen(category.idCategoria)" class="category-dropdown">
          <RouterLink :to="{ path: '/catalogo', query: { categoria: category.Nombre } }" class="category-view-all">
            Ver todo {{ category.Nombre }}
            <ArrowRight :size="17" :stroke-width="2.5" />
          </RouterLink>

          <div v-if="hasChildren(category.idCategoria)" class="category-children">
            <CategoryNode v-for="child in getChildren(category.idCategoria)" :key="child.idCategoria" :category="child" :level="1" />
          </div>

          <p v-else class="category-empty">No hay subcategorías.</p>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped></style>