/**
 * Servicio del carrito del frontend de Funkomanía.
 * Centraliza las peticiones HTTP al carrito del usuario autenticado.
 *
 * @author Viktoriia Bohoslavska
 */
import { apiRequest } from './api'
// Obtiene el carrito completo del usuario autenticado
export async function getBackendCart() {
  return apiRequest('/carrito/')
}
// Añade un producto al carrito
export async function addBackendCartProduct(idProducto, cantidad = 1) {
  return apiRequest(`/carrito/${idProducto}?cantidad=${cantidad}`, {
    method: 'POST'
  })
}
// Actualiza la cantidad exacta de un producto del carrito
export async function updateBackendCartProduct(idProducto, cantidad) {
  return apiRequest(`/carrito/${idProducto}?cantidad=${cantidad}`, {
    method: 'PUT'
  })
}
// Elimina un producto del carrito
export async function deleteBackendCartProduct(idProducto) {
  return apiRequest(`/carrito/${idProducto}`, {
    method: 'DELETE'
  })
}
// Vacía todo el carrito
export async function clearBackendCart() {
  return apiRequest('/carrito/', {
    method: 'DELETE'
  })
}