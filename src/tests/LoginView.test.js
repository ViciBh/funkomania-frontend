/**
 * Pruebas de componente para LoginView.
 *
 * Comprueba la validación del formulario de inicio de sesión,
 * la llamada al servicio de autenticación y la redirección según rol.
 *
 * @author Viktoriia Bohoslavska
 */

import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const routerMocks = vi.hoisted(() => ({
  push: vi.fn(),
  route: { query: {} }
}))

const authServiceMocks = vi.hoisted(() => ({ loginUser: vi.fn() }))

const authMocks = vi.hoisted(() => ({
  setAuthUser: vi.fn(),
  isAdmin: { value: false }
}))

vi.mock('vue-router', () => ({
  RouterLink: { template: '<a><slot /></a>' },
  useRouter: () => ({ push: routerMocks.push }),
  useRoute: () => routerMocks.route
}))

vi.mock('@/services/authService', () => ({ loginUser: authServiceMocks.loginUser }))

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => authMocks
}))

import LoginView from '@/views/LoginView.vue'

describe('LoginView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authMocks.isAdmin.value = false
    routerMocks.route.query = {}
  })

  it('muestra error si faltan campos obligatorios', async () => {
    const wrapper = mount(LoginView)
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Introduce tu email y contraseña')
    expect(authServiceMocks.loginUser).not.toHaveBeenCalled()
  })

  it('inicia sesión y redirige al inicio si el usuario es cliente', async () => {
    authServiceMocks.loginUser.mockResolvedValue({ token: 'token-test', username: 'user@test.com', name: 'User', role: 'CLIENTE' })
    const wrapper = mount(LoginView)
    await wrapper.find('input[placeholder="Introduce tu email"]').setValue('user@test.com')
    await wrapper.find('input[placeholder="Introduce tu contraseña"]').setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    expect(authServiceMocks.loginUser).toHaveBeenCalledWith({ username: 'user@test.com', password: '123456' })
    expect(authMocks.setAuthUser).toHaveBeenCalled()
    expect(routerMocks.push).toHaveBeenCalledWith('/')
  })

  it('redirige al panel admin si el usuario tiene rol ADMIN', async () => {
    authMocks.isAdmin.value = true
    authServiceMocks.loginUser.mockResolvedValue({ token: 'token-admin', username: 'admin@test.com', name: 'Admin', role: 'ADMIN' })
    const wrapper = mount(LoginView)
    await wrapper.find('input[placeholder="Introduce tu email"]').setValue('admin@test.com')
    await wrapper.find('input[placeholder="Introduce tu contraseña"]').setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    expect(routerMocks.push).toHaveBeenCalledWith('/admin')
  })

  it('muestra error si el backend rechaza el login', async () => {
    authServiceMocks.loginUser.mockRejectedValue(new Error('Credenciales incorrectas'))
    const wrapper = mount(LoginView)
    await wrapper.find('input[placeholder="Introduce tu email"]').setValue('bad@test.com')
    await wrapper.find('input[placeholder="Introduce tu contraseña"]').setValue('wrong')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.text()).toContain('Email o contraseña incorrectos')
  })
})