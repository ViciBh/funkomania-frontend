/**
 * Servicio de autenticación del frontend de Funkomanía.
 * Define las peticiones de registro e inicio de sesión contra el backend.
 *
 * @author Viktoriia Bohoslavska
 */
import { apiRequest } from './api'
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
 *
 * @param {Object} credentials Datos introducidos en el formulario de login.
 * @param {string} credentials.username Correo electrónico usado como nombre de usuario.
 * @param {string} credentials.password Contraseña del usuario.
 * @returns {Promise<Object>} Datos devueltos por el backend, incluyendo token, username y name.
 */
export async function loginUser(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password
    })
  })
}