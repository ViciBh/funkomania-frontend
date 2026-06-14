/**
 * Pruebas unitarias del servicio de autenticación.
 * Comprueba que registro e inicio de sesión envían al backend los datos con el formato esperado por la API.
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

const apiMocks = vi.hoisted(() => ({ apiRequest: vi.fn() }))

vi.mock('@/services/api', () => ({ apiRequest: apiMocks.apiRequest }))

import { registerUser, loginUser } from '@/services/authService'

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registra un usuario con email, password y nombre', async () => {
    apiMocks.apiRequest.mockResolvedValue({ ok: true })
    await registerUser({ email: 'test@test.com', password: '123456', nombre: 'Ana' })
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: '123456', nombre: 'Ana' })
    })
  })

  it('inicia sesión con username y password', async () => {
    apiMocks.apiRequest.mockResolvedValue({ token: 'token-test' })
    const result = await loginUser({ username: 'test@test.com', password: '123456' })
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'test@test.com', password: '123456' })
    })
    expect(result.token).toBe('token-test')
  })
})