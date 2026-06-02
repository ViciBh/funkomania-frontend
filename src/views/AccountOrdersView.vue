<script setup>
import '../assets/styles/accountOrder.css'
import batmanImg from '../assets/products/batman.png'
const orders = [
  {
    fecha: '10/05/2026',
    productos: [
      {
        id: 1,
        nombre: 'Camiseta Negra',
        cantidad: 2,
        imagen: batmanImg,
        estado: 'Enviado',
        precio: 19.99
      },
      {
        id: 2,
        nombre: 'Sudadera Azul',
        cantidad: 1,
        imagen: '/img/sudadera-azul.jpg',
        estado: 'Enviado',
        precio: 29.99
      }
    ]
  },
  {
    fecha: '08/05/2026',
    productos: [
      {
        id: 3,
        nombre: 'Gorra Blanca',
        cantidad: 1,
        imagen: '/img/gorra-blanca.jpg',
        estado: 'Preparando',
        precio: 24.95
      }
    ]
  }
]
</script>

<template>
  <main class="orders-page">
    <section class="orders-header">
      <h1>Mis Pedidos</h1>
      <p>Consulta el historial de compras realizadas.</p>
    </section>

    <section
      v-for="group in orders"
      :key="group.fecha"
      class="date-group"
    >
      <h2 class="date-title">
        {{ group.fecha }}
      </h2>

      <article
        v-for="product in group.productos"
        :key="product.id"
        class="product-row"
        >
        <div class="quantity">
            x{{ product.cantidad }}
        </div>

        <img
            :src="product.imagen"
            :alt="product.nombre"
            class="product-image"
        />

        <div class="product-name">
            {{ product.nombre }}
        </div>

        <span
            class="order-status"
            :class="{
            delivered: product.estado === 'Entregado',
            shipping: product.estado === 'Enviado',
            preparing: product.estado === 'Preparando'
            }"
        >
            {{ product.estado }}
        </span>

        <div class="product-price">
            {{ product.precio.toFixed(2) }}€
        </div>
    </article>
    </section>
  </main>
</template>