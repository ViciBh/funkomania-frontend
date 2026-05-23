<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { Sparkles, ChevronDown, ChevronRight, ArrowRight } from 'lucide-vue-next'
import { categories, products, productMatchesCategory } from '@/data/products'

const openCategories = ref([])
const categoriesPageRef = ref(null)

const activeProducts = computed(() => {
  return products.filter((product) => product.Activo === 1)
})

const parentCategories = computed(() => {
  return categories.filter((category) => category.CategoriaPadre === null)
})

function getChildren(idCategoria) {
  return categories.filter((category) => category.CategoriaPadre === idCategoria)
}

function hasChildren(idCategoria) {
  return getChildren(idCategoria).length > 0
}

function getCategoryTotal(categoryName) {
  return activeProducts.value.filter((product) => productMatchesCategory(product, categoryName)).length
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

onMounted(() => {
  document.addEventListener('click', closeCategories)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeCategories)
})
</script>

<template>
  <main class="categories-page" ref="categoriesPageRef">
    <section class="categories-header">
      <div class="categories-icon"><Sparkles :size="34" :stroke-width="2.5" /></div>
      <p class="categories-kicker">Categorías</p>
      <h1>Explora por temática</h1>
      <p>Abre una categoría principal para ver sus subcategorías y acceder al catálogo filtrado.</p>
    </section>

    <section class="categories-grid">
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
            <template v-for="child in getChildren(category.idCategoria)" :key="child.idCategoria">
              <button v-if="hasChildren(child.idCategoria)" class="category-child-row" type="button" @click.stop="toggleCategory(child.idCategoria)">
                <span>{{ child.Nombre }}</span>
                <small>{{ getCategoryTotal(child.Nombre) }} productos</small>
                <ChevronDown v-if="isOpen(child.idCategoria)" :size="17" :stroke-width="2.5" />
                <ChevronRight v-else :size="17" :stroke-width="2.5" />
              </button>

              <RouterLink v-else :to="{ path: '/catalogo', query: { categoria: child.Nombre } }" class="category-child-row">
                <span>{{ child.Nombre }}</span>
                <small>{{ getCategoryTotal(child.Nombre) }} productos</small>
                <ArrowRight :size="16" :stroke-width="2.5" />
              </RouterLink>

              <div v-if="hasChildren(child.idCategoria) && isOpen(child.idCategoria)" class="category-subchildren">
                <RouterLink :to="{ path: '/catalogo', query: { categoria: child.Nombre } }" class="category-subchild-row category-subchild-all">
                  Ver todo {{ child.Nombre }}
                  <ArrowRight :size="15" :stroke-width="2.5" />
                </RouterLink>

                <RouterLink v-for="subchild in getChildren(child.idCategoria)" :key="subchild.idCategoria" :to="{ path: '/catalogo', query: { categoria: subchild.Nombre } }" class="category-subchild-row">
                  <span>{{ subchild.Nombre }}</span>
                  <small>{{ getCategoryTotal(subchild.Nombre) }} productos</small>
                </RouterLink>
              </div>
            </template>
          </div>

          <p v-else class="category-empty">No hay subcategorías.</p>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped></style>