/**
 * Servicio de direcciones del frontend de Funkomanía.
 * Conecta las direcciones del usuario autenticado con la API backend.
 *
 * @author Viktoriia Bohoslavska
 */
import { apiRequest } from './api'

function mapAddressFromBackend(address = {}) {
  return {
    idDireccion: address.idDireccion ?? address.id ?? null,
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
    calle: address.Calle.trim(),
    numero: address.Numero.trim(),
    piso: address.Piso?.trim() || '',
    puerta: address.Puerta?.trim() || '',
    ciudad: address.Ciudad.trim(),
    municipio: address.Municipio.trim(),
    provincia: address.Provincia.trim(),
    codigoPostal: address.CP.trim(),
    activo: true
  }
}

export async function getUserAddresses() {
  const data = await apiRequest('/usuario/direcciones/')
  if (!Array.isArray(data)) return []
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