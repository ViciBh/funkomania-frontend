/**
 * Composable de autenticación del frontend de Funkomanía.
 * Mantiene el estado reactivo del usuario autenticado a partir de los datos guardados en localStorage.
 *
 * @author Viktoriia Bohoslavska
 */
import { computed, ref } from 'vue'
import { setToken, removeToken } from '@/services/api'

const authUser = ref({
  token: localStorage.getItem('token') || '',
  username: localStorage.getItem('username') || '',
  name: localStorage.getItem('name') || ''
})

const isAuthenticated = computed(() => {
  return !!authUser.value.token
})

function setAuthUser(data) {
  setToken(data.token)
  localStorage.setItem('username', data.username)
  localStorage.setItem('name', data.name)
  authUser.value = {
    token: data.token,
    username: data.username,
    name: data.name
  }
}

function refreshAuthUser() {
  authUser.value = {
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
    name: localStorage.getItem('name') || ''
  }
}

function clearAuthUser() {
  removeToken()
  localStorage.removeItem('username')
  localStorage.removeItem('name')
  authUser.value = {
    token: '',
    username: '',
    name: ''
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
    setAuthUser,
    refreshAuthUser,
    clearAuthUser,
    getLoginRedirect
  }
}