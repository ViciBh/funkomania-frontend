<script setup>
import { RouterLink } from 'vue-router'
import { BadgePercent, ShoppingBag, Sparkles } from 'lucide-vue-next'
</script>

<template>
  <main class="main">
    <section class="container">
      <section class="page-title">
        <img src="../assets/funkomania.png" alt="Funkomanía" class="page-title-img" />
      </section>

      <p class="slogan">Figuras Funko Pop para fans de la cultura geek</p>

      <section class="home-sections" aria-label="Sección principal">
        <RouterLink to="/ofertas" class="home-card home-card-offers">
          <span class="card-icon">
            <BadgePercent :size="30" :stroke-width="2.5" />
          </span>
          <h2>OFERTAS</h2>
          <p>Descuentos y promociones especiales</p>
        </RouterLink>

        <RouterLink to="/catalogo" class="home-card home-card-products">
          <span class="card-icon">
            <ShoppingBag :size="30" :stroke-width="2.5" />
          </span>
          <h2>TODOS LOS PRODUCTOS</h2>
          <p>Explora el catálogo completo</p>
        </RouterLink>

        <RouterLink to="/categorias" class="home-card home-card-categories">
          <span class="card-icon">
            <Sparkles :size="30" :stroke-width="2.5" />
          </span>
          <h2>CATEGORÍAS</h2>
          <p>Busca por sagas y temáticas</p>
        </RouterLink>
      </section>
    </section>
  </main>
</template>