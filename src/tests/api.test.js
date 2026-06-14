/**
 * Pruebas unitarias del servicio base de API.
 *
 * Este archivo comprueba la gestión del token de sesión y la creación de peticiones HTTP hacia el backend mediante apiRequest.
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { apiRequest, getToken, setToken, removeToken } from '@/services/api'

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

describe('api service', () => {
  beforeEach(() => {
    // Antes de cada prueba se limpia localStorage y se simula fetch.
    localStorage.clear()
    globalThis.fetch = vi.fn()
  })

  it('guarda, obtiene y elimina el token', () => {
    // Se comprueba que el token se guarda correctamente.
    setToken('token-test')
    expect(getToken()).toBe('token-test')
    // Se comprueba que el token se elimina correctamente.
    removeToken()
    expect(getToken()).toBe(null)
  })

  it('envía Authorization header cuando existe token', async () => {
    setToken('token-test')
    globalThis.fetch.mockResolvedValue(jsonResponse({ ok: true }))
    await apiRequest('/productos/')
    // Si existe token, la petición debe incluir el header Authorization.
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/productos/', expect.objectContaining({
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-test'
      })
    }))
  })

  it('lanza error cuando backend responde con error', async () => {
    // Simulamos una respuesta de error del backend.
    globalThis.fetch.mockResolvedValue(jsonResponse({ message: 'Error backend' }, 400))
    // apiRequest debe lanzar una excepción con el mensaje recibido.
    await expect(apiRequest('/error')).rejects.toThrow('Error backend')
  })
})