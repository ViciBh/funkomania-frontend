<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

function handleRegister() {
  if (password.value !== confirmPassword.value) {
    console.log('Las contraseñas no coinciden')
    return
  }

  console.log('Registro:', email.value, password.value)
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <h1>Crear cuenta</h1>
      <form class="login-form" @submit.prevent="handleRegister">
        <label class="login-field">
          <span>Usuario</span>
          <input v-model="email" type="email" placeholder="Introduce tu email" />
        </label>

        <label class="login-field">
          <span>Contraseña</span>
          <input v-model="password" type="password" placeholder="Introduce tu contraseña" />
        </label>

        <label class="login-field">
          <span>Repetir contraseña</span>
          <input v-model="confirmPassword" type="password" placeholder="Repite tu contraseña" />
        </label>

        <button class="login-button" type="submit">Crear cuenta</button>
        <RouterLink to="/login" class="forgot-link">Ya tengo cuenta</RouterLink>
      </form>
    </section>
  </main>
</template>