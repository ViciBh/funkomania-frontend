<script setup>
import { ref, onMounted } from 'vue'
import { User } from 'lucide-vue-next'
import { getUserProfile } from '@/services/userService'

const user = ref(null)
const loading = ref(true)
const errorMessage = ref('')

async function loadProfile() {
  try {
    user.value = await getUserProfile()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'No se pudo cargar el perfil del usuario'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <main class="account-page">
    <section class="account-header">
      <h1>Mi Cuenta</h1>
      <p>Consulta y gestiona tu información personal.</p>
    </section>

    <section v-if="loading" class="account-content">
      <p>Cargando perfil...</p>
    </section>

    <section v-else-if="errorMessage" class="account-content">
      <p>{{ errorMessage }}</p>
    </section>

    <section v-else-if="user" class="account-content">
      <div class="account-card">
        <div class="card-title">
          <User :size="22" />
          <h2>Datos personales</h2>
        </div>

        <div class="card-body">
          <p><strong>Nombre:</strong> {{ user.nombre }}</p>
          <p><strong>Apellidos:</strong> {{ user.apellidos }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Teléfono:</strong> {{ user.telefono || 'No especificado' }}</p>
          <p><strong>Dirección principal:</strong> {{ user.direccionPrincipal || 'No especificada' }}</p>
          <p>
            <strong>Fecha de registro:</strong>
            {{ user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString('es-ES') : 'No disponible' }}
          </p>
          <p><strong>Pedidos realizados:</strong> {{ user.cantidadPedidos }}</p>
          <p><strong>Total gastado:</strong> {{ Number(user.totalGastado || 0).toFixed(2) }} €</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>.account-page {
  max-width: 1200px;
  margin: auto;
  padding: 40px 20px;
}

.account-header {
  margin-bottom: 30px;
}

.account-header h1 {
  font-size: 2.2rem;
}

.account-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}

.account-card {
  background: white;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(0,0,0,.08);
}

.full-width {
  grid-column: span 2;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.card-title h2 {
  margin: 0;
}

.card-body p {
  margin-bottom: 10px;
}</style>