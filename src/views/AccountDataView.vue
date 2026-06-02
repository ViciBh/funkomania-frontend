<script setup>
import { User, MapPin, CreditCard } from 'lucide-vue-next'
</script>

<template>
  <main class="account-page">
    <section class="account-header">
      <h1>Mi Cuenta</h1>
      <p>Gestiona tus datos personales y métodos de pago.</p>
    </section>

    <section class="account-content">

      <div class="account-card">
        <div class="card-title">
          <User :size="22" />
          <h2>Datos personales</h2>
        </div>

        <div class="card-body">
          <p><strong>Nombre:</strong> Iván</p>
          <p><strong>Apellidos:</strong> Rodríguez</p>
          <p><strong>Email:</strong> ivan@email.com</p>
          <p><strong>Teléfono:</strong> 600 123 456</p>
        </div>
      </div>

      <div class="account-card">
        <div class="card-title">
          <MapPin :size="22" />
          <h2>Dirección</h2>
        </div>

        <div class="card-body">
          <p>Calle Principal 12</p>
          <p>28001 Madrid</p>
          <p>España</p>
        </div>
      </div>

      <div class="account-card full-width">
        <div class="card-title">
          <CreditCard :size="22" />
          <h2>Métodos de pago</h2>
        </div>

        <div class="card-body">
          <p>Visa **** **** **** 1234</p>
          <p>Caducidad: 12/28</p>
        </div>
      </div>

    </section>
  </main>
</template>

<style scoped>
.account-page {
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
}
</style>