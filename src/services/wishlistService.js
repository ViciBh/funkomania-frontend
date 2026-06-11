/**
 * Servicio de lista de deseos del frontend de Funkomanía.
 * Conecta la lista de deseos del usuario autenticado con la API backend.
 *
 * @author Viktoriia Bohoslavska
 */
import { apiRequest } from './api'

export async function getWishlistProducts() {
  return apiRequest('/usuario/lista-deseos/')
}

export async function addWishlistProduct(idProducto) {
  return apiRequest(`/usuario/lista-deseos/${idProducto}`, {
    method: 'POST'
  })
}

export async function deleteWishlistProduct(idProducto) {
  return apiRequest(`/usuario/lista-deseos/${idProducto}`, {
    method: 'DELETE'
  })
}