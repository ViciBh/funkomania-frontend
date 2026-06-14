/**
 * Servicio de administración del frontend de Funkomanía.
 * Centraliza las peticiones HTTP a los endpoints de administrador.
 *
 * @author Viktoriia Bohoslavska
 */
import { apiRequest } from './api'

function buildQuery(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      query.append(key, value)
    }
  })

  const queryText = query.toString()
  return queryText ? `?${queryText}` : ''
}

export async function getAdminStockAlerts() {
  return apiRequest('/admin/alertas-stock/')
}

export async function getAdminUsers(search = '') {
  return apiRequest(`/admin/usuarios/${buildQuery({ search })}`)
}

export async function getAdminProducts(search = '') {
  return apiRequest(`/admin/productos/${buildQuery({ search })}`)
}

export async function createAdminProduct(productData) {
  return apiRequest('/admin/productos/', {
    method: 'POST',
    body: JSON.stringify(productData)
  })
}

export async function updateAdminProduct(idProducto, productData) {
  return apiRequest(`/admin/productos/${idProducto}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  })
}

export async function deleteAdminProduct(idProducto) {
  return apiRequest(`/admin/productos/${idProducto}`, {
    method: 'DELETE'
  })
}

export async function getAdminCategories() {
  return apiRequest('/admin/categorias/')
}

export async function createAdminCategory(categoryData) {
  return apiRequest('/admin/categorias/', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  })
}

export async function updateAdminCategory(idCategoria, categoryData) {
  return apiRequest(`/admin/categorias/${idCategoria}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData)
  })
}

export async function deleteAdminCategory(idCategoria) {
  return apiRequest(`/admin/categorias/${idCategoria}`, {
    method: 'DELETE'
  })
}

export async function getAdminOrders(filters = {}) {
  return apiRequest(`/admin/pedidos/${buildQuery(filters)}`)
}

export async function getAdminOrderDetail(idPedido) {
  return apiRequest(`/admin/pedidos/${idPedido}`)
}

export async function createAdminOrder(orderData) {
  return apiRequest('/admin/pedidos/', {
    method: 'POST',
    body: JSON.stringify(orderData)
  })
}

export async function updateAdminOrder(idPedido, orderData) {
  return apiRequest(`/admin/pedidos/${idPedido}`, {
    method: 'PUT',
    body: JSON.stringify(orderData)
  })
}

export async function addAdminOrderLine(idPedido, lineData) {
  return apiRequest(`/admin/pedidos/${idPedido}/lineas`, {
    method: 'POST',
    body: JSON.stringify(lineData)
  })
}

export async function updateAdminOrderLine(idPedido, idProducto, lineData) {
  return apiRequest(`/admin/pedidos/${idPedido}/lineas/${idProducto}`, {
    method: 'PUT',
    body: JSON.stringify(lineData)
  })
}

export async function deleteAdminOrderLine(idPedido, idProducto) {
  return apiRequest(`/admin/pedidos/${idPedido}/lineas/${idProducto}`, {
    method: 'DELETE'
  })
}

export async function getPaymentMethods() {
  return apiRequest('/metodos-pago/')
}