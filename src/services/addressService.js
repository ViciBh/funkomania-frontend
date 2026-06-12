/**
 * Servicio de direcciones del frontend de Funkomanía.
 * Conecta las direcciones del usuario autenticado con la API backend.
 *
 * @author Viktoriia Bohoslavska
 */
import { apiRequest } from './api'

function mapAddressFromBackend(address) {
  return {
    idDireccion: address.idDireccion || address.id,
    Calle: address.calle || '',
    Numero: address.numero || '',
    Piso: address.piso || '',
    Puerta: address.puerta || '',
    Ciudad: address.ciudad || '',
    Municipio: address.municipio || '',
    Provincia: address.provincia || '',
    CP: address.codigoPostal || '',
    Activo: address.activo ? 1 : 0
  }
}

function mapAddressToBackend(address) {
  return {
    calle: address.Calle,
    numero: address.Numero,
    piso: address.Piso || '',
    puerta: address.Puerta || '',
    ciudad: address.Ciudad,
    municipio: address.Municipio,
    provincia: address.Provincia,
    codigoPostal: address.CP,
    activo: true
  }
}

export function formatAddress(address) {
  if (!address) return ''
  return `${address.Calle} ${address.Numero}${address.Piso ? ', Piso ' + address.Piso : ''}${address.Puerta ? ', Puerta ' + address.Puerta : ''}, ${address.CP}, ${address.Ciudad} (${address.Provincia})`
}

export async function getUserAddresses() {
  const data = await apiRequest('/usuario/direcciones/')
  return data.map(mapAddressFromBackend)
}

export async function createUserAddress(address) {
  const data = await apiRequest('/usuario/direcciones/', {
    method: 'POST',
    body: JSON.stringify(mapAddressToBackend(address))
  })

  if (!data) return null
  return mapAddressFromBackend(data)
}

export async function updateUserAddress(idDireccion, address) {
  const data = await apiRequest(`/usuario/direcciones/${idDireccion}`, {
    method: 'PUT',
    body: JSON.stringify(mapAddressToBackend(address))
  })

  if (!data) return null
  return mapAddressFromBackend(data)
}

export async function activateUserAddress(idDireccion) {
  return apiRequest(`/usuario/direcciones/${idDireccion}/activar`, { method: 'PUT' })
}