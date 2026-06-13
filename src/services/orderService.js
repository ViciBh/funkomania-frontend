/**
 * Servicio de pedidos del frontend de Funkomanía.
 * Conecta el checkout con la API backend para crear pedidos reales desde el carrito.
 *
 * @author Viktoriia Bohoslavska
 */
import { apiRequest } from './api'

export async function createOrderFromCart(orderData) {
  return apiRequest('/pedidos/crear-desde-pedido', {
    method: 'POST',
    body: JSON.stringify({
      idDireccion: orderData.idDireccion,
      idMetodoPago: orderData.idMetodoPago,
      comentarios: orderData.comentarios || ''
    })
  })
}