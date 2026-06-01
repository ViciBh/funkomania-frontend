/**
 * Vista de inicio de sesión de Funkomanía.
 * Permite al usuario introducir sus datos de acceso y autenticarse mediante la API backend.
 *
 * @author Viktoriia Bohoslavska
 */
<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { loginUser } from '@/services/authService'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
/**
 * Gestiona el envío del formulario de inicio de sesión.
 * Valida que los campos obligatorios estén completos y envía los datos al backend.
 */
async function handleLogin() {
  errorMessage.value = ''
  if (!email.value || !password.value) {
    errorMessage.value = 'Introduce tu email y contraseña'
    return
  }
  try {
    /**
     * Petición al backend.
     * El backend espera los campos: username y password.
     * En el frontend usamos el campo email, pero lo enviamos como username.
     */
    const user = await loginUser({
      username: email.value,
      password: password.value
    })
    /**
     * Si el login es correcto, el token se guarda desde authService.js.
     * Después se redirige al usuario a la página principal.
     */
    console.log('Login correcto:', user)
    router.push('/')
  } catch (error) {
    errorMessage.value = 'Email o contraseña incorrectos'
    console.error('Error login:', error)
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <h1>Inicio de sesión</h1>
      <form class="login-form" @submit.prevent="handleLogin">
        <label class="login-field">
          <span>Usuario</span>
          <input v-model="email" type="email" placeholder="Introduce tu email" required />
        </label>
        <label class="login-field">
          <span>Contraseña</span>
          <input v-model="password" type="password" placeholder="Introduce tu contraseña" required />
        </label>
        <a href="#" class="forgot-link">¿Has olvidado tu contraseña?</a>
        <p v-if="errorMessage" class="login-error">{{ errorMessage }}</p>
        <button class="login-button" type="submit">Iniciar sesión</button>
        <RouterLink to="/registro" class="register-button">Crear cuenta</RouterLink>
      </form>
    </section>
  </main>
</template>