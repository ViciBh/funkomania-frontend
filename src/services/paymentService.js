/**
 * Servicio de métodos de pago del frontend de Funkomanía.
 * Obtiene los métodos de pago activos desde el backend.
 *
 * @author Viktoriia Bohoslavska
 */
import { apiRequest } from './api'

function getPaymentMessage(methodName) {
  const messages = {
    'Tarjeta bancaria': 'Introduce los datos de una tarjeta ficticia para simular el pago.',
    'PayPal': 'En una tienda real se abriría PayPal para iniciar sesión y confirmar el pago.',
    'Bizum': 'Introduce el teléfono asociado a Bizum para simular la operación.',
    'Transferencia bancaria': 'El pedido quedará pendiente hasta recibir la transferencia.',
    'Contra reembolso': 'El pago se realizará al recibir el pedido.',
    'Google Pay': 'En una tienda real se abriría la cartera digital del dispositivo.',
    'Apple Pay': 'En una tienda real se abriría la cartera digital del dispositivo.'
  }

  return messages[methodName] || 'Método de pago simulado.'
}

function getPaymentType(methodName) {
  const types = {
    'Tarjeta bancaria': 'card',
    'PayPal': 'paypal',
    'Bizum': 'bizum',
    'Transferencia bancaria': 'transfer',
    'Contra reembolso': 'cash',
    'Google Pay': 'wallet',
    'Apple Pay': 'wallet'
  }

  return types[methodName] || 'generic'
}

function mapPaymentMethodFromBackend(method) {
  return {
    idMetodoPago: method.id,
    Nombre: method.nombre,
    Activo: method.activo ? 1 : 0,
    Mensaje: getPaymentMessage(method.nombre),
    Tipo: getPaymentType(method.nombre)
  }
}

export async function getPaymentMethods() {
  const data = await apiRequest('/metodos-pago/')
  return data.filter((method) => method.activo).map(mapPaymentMethodFromBackend)
}