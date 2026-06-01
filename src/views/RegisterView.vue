/**
 * Vista de registro de Funkomanía.
 * Permite crear una nueva cuenta de usuario mediante la API backend.
 *
 * @author Viktoriia Bohoslavska
 */
<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { registerUser } from '@/services/authService'

const router = useRouter()
const nombre = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')

/**
 * Gestiona el envío del formulario de registro.
 * Valida campos obligatorios, comprueba que las contraseñas coincidan
 * y envía los datos al backend mediante el servicio de autenticación.
 */
async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''
  if (!nombre.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Completa los campos obligatorios'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }
  try {
    /**
     * Petición al backend.
     * El backend espera los campos: email, password y nombre.
     */
    await registerUser({
      email: email.value,
      password: password.value,
      nombre: nombre.value
    })
    successMessage.value = 'Cuenta creada correctamente'

    /**
     * Después del registro, el usuario debe iniciar sesión.
     * El backend no devuelve token directamente al registrar.
     */
    router.push('/login')
  } catch (error) {
    errorMessage.value = 'No se pudo crear la cuenta'
    console.error('Error registro:', error)
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <h1>Crear cuenta</h1>
      <form class="login-form" @submit.prevent="handleRegister">
        <label class="login-field">
          <span>Usuario</span>
          <input v-model="email" type="email" placeholder="Introduce tu email" required />
        </label>

        <label class="login-field">
          <span>Nombre</span>
          <input v-model="nombre" type="text" placeholder="Introduce tu nombre" required />
        </label>

        <label class="login-field">
          <span>Contraseña</span>
          <input v-model="password" type="password" placeholder="Introduce tu contraseña" required />
        </label>

        <label class="login-field">
          <span>Repetir contraseña</span>
          <input v-model="confirmPassword" type="password" placeholder="Repite tu contraseña" required />
        </label>
        <p v-if="errorMessage" class="login-error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="login-success">{{ successMessage }}</p>
        <button class="login-button" type="submit">Crear cuenta</button>
        <RouterLink to="/login" class="forgot-link">Ya tengo cuenta</RouterLink>
      </form>
    </section>
  </main>
</template>