/**
 * Servicio de autenticación del frontend de Funkomanía.
 * Define las peticiones de registro e inicio de sesión contra el backend
 * y guarda temporalmente el token de autenticación en localStorage.
 *
 * @author Viktoriia Bohoslavska
 */

import { apiRequest, setToken, removeToken } from './api'

/**
 * Registra un nuevo usuario en el sistema mediante la API backend.
 *
 * @param {Object} userData Datos introducidos en el formulario de registro.
 * @param {string} userData.email Correo electrónico del usuario.
 * @param {string} userData.password Contraseña del usuario.
 * @param {string} userData.nombre Nombre del usuario.
 * @returns {Promise<Object|null>} Respuesta del backend tras registrar el usuario.
 */
export async function registerUser(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      nombre: userData.nombre
    })
  })
}

/**
 * Inicia sesión en la aplicación mediante la API backend.
 * Si la autenticación es correcta, guarda el token y datos básicos del usuario en localStorage.
 *
 * @param {Object} credentials Datos introducidos en el formulario de login.
 * @param {string} credentials.username Correo electrónico usado como nombre de usuario.
 * @param {string} credentials.password Contraseña del usuario.
 * @returns {Promise<Object>} Datos devueltos por el backend, incluyendo token, username y name.
 */
export async function loginUser(credentials) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password
    })
  })

  if (data.token) {
    setToken(data.token)
    localStorage.setItem('username', data.username)
    localStorage.setItem('name', data.name)
  }

  return data
}
/**
 * Cierra la sesión del usuario en el frontend.
 * Elimina el token y los datos básicos guardados en localStorage.
 */
export function logoutUser() {
  removeToken()
  localStorage.removeItem('username')
  localStorage.removeItem('name')
}