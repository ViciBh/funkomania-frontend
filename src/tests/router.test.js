/**
 * Pruebas unitarias de configuración de rutas
 * Comprueba que las rutas principales de la aplicación están registradas en Vue Router
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect } from 'vitest'
import router from '@/router'

describe('router', () => {
  it('contiene las rutas principales del proyecto', () => {
    const paths = router.getRoutes().map((route) => route.path)
    expect(paths).toContain('/')
    expect(paths).toContain('/catalogo')
    expect(paths).toContain('/categorias')
    expect(paths).toContain('/ofertas')
    expect(paths).toContain('/producto/:id')
    expect(paths).toContain('/login')
    expect(paths).toContain('/registro')
    expect(paths).toContain('/carrito')
    expect(paths).toContain('/checkout')
    expect(paths).toContain('/admin')
    expect(paths).toContain('/cuenta-datos')
    expect(paths).toContain('/cuenta-pedidos')
    expect(paths).toContain('/lista-deseos')
  })
})