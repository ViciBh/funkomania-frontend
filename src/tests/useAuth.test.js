/**
 * Pruebas unitarias del composable useAuth
 * Este archivo comprueba la gestión del usuario autenticado, el almacenamiento de datos de sesión en localStorage y la detección del rol de administrador.
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

async function loadUseAuth() {
  vi.resetModules()
  return await import('@/composables/useAuth')
}

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('detecta que el usuario no está autenticado si no hay token', async () => {
    const { useAuth } = await loadUseAuth()
    const { isAuthenticated, isAdmin } = useAuth()
    expect(isAuthenticated.value).toBe(false)
    expect(isAdmin.value).toBe(false)
  })

  it('guarda los datos del usuario autenticado', async () => {
    const { useAuth } = await loadUseAuth()
    const { authUser, isAuthenticated, isAdmin, setAuthUser } = useAuth()
    setAuthUser({
      token: 'token-admin',
      username: 'admin@test.com',
      name: 'Admin',
      role: 'ADMIN'
    })
    expect(localStorage.getItem('token')).toBe('token-admin')
    expect(localStorage.getItem('username')).toBe('admin@test.com')
    expect(localStorage.getItem('name')).toBe('Admin')
    expect(localStorage.getItem('role')).toBe('ADMIN')
    expect(authUser.value.username).toBe('admin@test.com')
    expect(isAuthenticated.value).toBe(true)
    expect(isAdmin.value).toBe(true)
  })

  it('limpia los datos de sesión al cerrar sesión', async () => {
    const { useAuth } = await loadUseAuth()
    const { authUser, isAuthenticated, clearAuthUser, setAuthUser } = useAuth()
    setAuthUser({
      token: 'token-user',
      username: 'user@test.com',
      name: 'User',
      role: 'CLIENTE'
    })
    clearAuthUser()
    expect(localStorage.getItem('token')).toBe(null)
    expect(localStorage.getItem('username')).toBe(null)
    expect(localStorage.getItem('name')).toBe(null)
    expect(localStorage.getItem('role')).toBe(null)
    expect(authUser.value.token).toBe('')
    expect(isAuthenticated.value).toBe(false)
  })

  it('genera la ruta de redirección al login', async () => {
    const { useAuth } = await loadUseAuth()
    const { getLoginRedirect } = useAuth()
    expect(getLoginRedirect('/checkout')).toEqual({
      path: '/login',
      query: { redirect: '/checkout' }
    })
  })
})