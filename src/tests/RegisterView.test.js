/**
 * Pruebas de componente para RegisterView.
 *
 * Este archivo comprueba el comportamiento del formulario de registro:  nombre, validación de contraseñas y envío correcto de datos al servicio de autenticación.
 *
 * @author Viktoriia Bohoslavska
 */

import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const routerMocks = vi.hoisted(() => ({
  push: vi.fn()
}))

const authMocks = vi.hoisted(() => ({
  registerUser: vi.fn()
}))
// Se simula vue-router para evitar navegación real durante los tests.
vi.mock('vue-router', () => ({
  RouterLink: { template: '<a><slot /></a>' },
  useRouter: () => ({
    push: routerMocks.push
  })
}))
// Se simula el servicio de registro para no llamar al backend real.
vi.mock('@/services/authService', () => ({
  registerUser: authMocks.registerUser
}))

import RegisterView from '@/views/RegisterView.vue'

describe('RegisterView', () => {
  beforeEach(() => {
    // Se limpian los mocks antes de cada prueba.
    vi.clearAllMocks()
  })

  it('muestra error si el nombre no es válido', async () => {
    const wrapper = mount(RegisterView)
    await wrapper.find('input[placeholder="Introduce tu email"]').setValue('test@test.com')
    await wrapper.find('input[placeholder="Introduce tu nombre"]').setValue('A1')
    await wrapper.find('input[placeholder="Introduce tu contraseña"]').setValue('123456')
    await wrapper.find('input[placeholder="Repite tu contraseña"]').setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    // El nombre contiene un número, por lo que debe mostrar error.
    expect(wrapper.text()).toContain('El nombre debe tener entre 2 y 50 caracteres')
    expect(authMocks.registerUser).not.toHaveBeenCalled()
  })

  it('muestra error si las contraseñas no coinciden', async () => {
    const wrapper = mount(RegisterView)
    await wrapper.find('input[placeholder="Introduce tu email"]').setValue('test@test.com')
    await wrapper.find('input[placeholder="Introduce tu nombre"]').setValue('Ana')
    await wrapper.find('input[placeholder="Introduce tu contraseña"]').setValue('123456')
    await wrapper.find('input[placeholder="Repite tu contraseña"]').setValue('654321')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    // Si las contraseñas son distintas, no se debe llamar al servicio de registro.
    expect(wrapper.text()).toContain('Las contraseñas no coinciden')
    expect(authMocks.registerUser).not.toHaveBeenCalled()
  })

  it('envía el formulario con datos válidos', async () => {
    authMocks.registerUser.mockResolvedValue({})
    const wrapper = mount(RegisterView)
    await wrapper.find('input[placeholder="Introduce tu email"]').setValue('ana@test.com')
    await wrapper.find('input[placeholder="Introduce tu nombre"]').setValue('Ana María')
    await wrapper.find('input[placeholder="Introduce tu contraseña"]').setValue('123456')
    await wrapper.find('input[placeholder="Repite tu contraseña"]').setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    // Con datos válidos, se llama al servicio de registro con los datos del formulario.
    expect(authMocks.registerUser).toHaveBeenCalledWith({
      email: 'ana@test.com',
      password: '123456',
      nombre: 'Ana María'
    })
    // Después del registro correcto, el usuario vuelve a la pantalla de login.
    expect(routerMocks.push).toHaveBeenCalledWith('/login')
  })
})