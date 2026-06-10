/**
 * Composable de autenticación del frontend de Funkomanía.
 * Mantiene el estado reactivo del usuario autenticado a partir de los datos guardados en localStorage.
 *
 * @author Viktoriia Bohoslavska
 */
import { computed, ref } from 'vue'
import { logoutUser } from '@/services/authService'

const authUser = ref({
  token: localStorage.getItem('token') || '',
  username: localStorage.getItem('username') || '',
  name: localStorage.getItem('name') || ''
})

const isAuthenticated = computed(() => {
  return !!authUser.value.token
})

function refreshAuthUser() {
  authUser.value = {
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
    name: localStorage.getItem('name') || ''
  }
}

function clearAuthUser() {
  logoutUser()
  refreshAuthUser()
}

export function useAuth() {
  return {
    authUser,
    isAuthenticated,
    refreshAuthUser,
    clearAuthUser
  }
}