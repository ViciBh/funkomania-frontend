/**
 * Composable de autenticación del frontend de Funkomanía.
 * Mantiene el estado reactivo del usuario autenticado, incluyendo su rol.
 *
 * @author Viktoriia Bohoslavska
 */
import { computed, ref } from 'vue'
import { setToken, removeToken } from '@/services/api'

const authUser = ref({
  token: localStorage.getItem('token') || '',
  username: localStorage.getItem('username') || '',
  name: localStorage.getItem('name') || '',
  role: localStorage.getItem('role') || ''
})

const isAuthenticated = computed(() => {
  return !!authUser.value.token
})

const isAdmin = computed(() => {
  return String(authUser.value.role || '').toUpperCase() === 'ADMIN'
})

function setAuthUser(data) {
  const role = data.role || data.rol || ''
  setToken(data.token)
  localStorage.setItem('username', data.username)
  localStorage.setItem('name', data.name)
  localStorage.setItem('role', role)
  authUser.value = {
    token: data.token,
    username: data.username,
    name: data.name,
    role
  }
}

function refreshAuthUser() {
  authUser.value = {
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
    name: localStorage.getItem('name') || '',
    role: localStorage.getItem('role') || ''
  }
}

function clearAuthUser() {
  removeToken()
  localStorage.removeItem('username')
  localStorage.removeItem('name')
  localStorage.removeItem('role')
  authUser.value = {
    token: '',
    username: '',
    name: '',
    role: ''
  }
}

function getLoginRedirect(path) {
  return {
    path: '/login',
    query: { redirect: path }
  }
}

export function useAuth() {
  return {
    authUser,
    isAuthenticated,
    isAdmin,
    setAuthUser,
    refreshAuthUser,
    clearAuthUser,
    getLoginRedirect
  }
}