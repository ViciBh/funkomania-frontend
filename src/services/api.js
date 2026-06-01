/**
 * Servicio base para la comunicación entre el frontend de Funkomanía y la API backend.
 * Centraliza la URL principal del servidor, la gestión del token de autenticación
 * y la ejecución de peticiones HTTP mediante fetch.
 *
 * @author Viktoriia Bohoslavska
 */

const API_URL = ''
/**
 * Obtiene el token de autenticación guardado en localStorage.
 *
 * @returns {string|null} Token del usuario autenticado o null si no existe.
 */
export function getToken() {
  return localStorage.getItem('token')
}

/**
 * Guarda el token de autenticación en localStorage.
 *
 * @param {string} token Token recibido desde el backend tras iniciar sesión.
 */
export function setToken(token) {
  localStorage.setItem('token', token)
}

/**
 * Elimina el token de autenticación guardado en localStorage.
 */
export function removeToken() {
  localStorage.removeItem('token')
}

/**
 * Ejecuta una petición HTTP contra la API backend.
 * Añade automáticamente las cabeceras JSON y el token Bearer si existe.
 *
 * @param {string} endpoint Ruta del endpoint que se quiere consultar.
 * @param {Object} options Opciones de la petición fetch: método, body, headers, etc.
 * @returns {Promise<Object|null>} Respuesta JSON del backend o null si no hay contenido.
 * @throws {Error} Lanza un error si la respuesta HTTP no es correcta.
 */
export async function apiRequest(endpoint, options = {}) {
  const token = getToken()
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Error en la petición')
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }

  return null
}