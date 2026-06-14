/**
 * Pruebas unitarias del servicio de direcciones.
 * Comprueba la adaptación de direcciones entre backend y frontend, así como las peticiones para obtener y crear direcciones de usuario.
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

const apiMocks = vi.hoisted(() => ({ apiRequest: vi.fn() }))

vi.mock('@/services/api', () => ({ apiRequest: apiMocks.apiRequest }))

import { getUserAddresses, createUserAddress } from '@/services/addressService'

describe('addressService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('obtiene y adapta direcciones del usuario', async () => {
    apiMocks.apiRequest.mockResolvedValue([
      { idDireccion: 1, calle: 'Mayor', numero: '10', piso: '2', puerta: 'A', ciudad: 'Murcia', municipio: 'Murcia', provincia: 'Murcia', codigoPostal: '30001', activo: true }
    ])
    const addresses = await getUserAddresses()
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/usuario/direcciones/')
    expect(addresses).toEqual([
      { idDireccion: 1, Calle: 'Mayor', Numero: '10', Piso: '2', Puerta: 'A', Ciudad: 'Murcia', Municipio: 'Murcia', Provincia: 'Murcia', CP: '30001', Activo: 1 }
    ])
  })

  it('devuelve array vacío si backend no devuelve una lista', async () => {
    apiMocks.apiRequest.mockResolvedValue(null)
    const addresses = await getUserAddresses()
    expect(addresses).toEqual([])
  })

  it('crea una dirección enviando el formato esperado por backend', async () => {
    apiMocks.apiRequest.mockResolvedValue({ idDireccion: 5, calle: 'Nueva', numero: '4', ciudad: 'Murcia', municipio: 'Murcia', provincia: 'Murcia', codigoPostal: '30002', activo: true })
    const result = await createUserAddress({
      Calle: ' Nueva ', Numero: ' 4 ', Piso: '', Puerta: '', Ciudad: ' Murcia ', Municipio: ' Murcia ', Provincia: ' Murcia ', CP: ' 30002 '
    })
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/usuario/direcciones/', {
      method: 'POST',
      body: JSON.stringify({ calle: 'Nueva', numero: '4', piso: '', puerta: '', ciudad: 'Murcia', municipio: 'Murcia', provincia: 'Murcia', codigoPostal: '30002', activo: true })
    })
    expect(result.idDireccion).toBe(5)
  })
})