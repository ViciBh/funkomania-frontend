/**
 * Pruebas E2E de Funkomanía con Playwright
 * Estas pruebas verifican flujos principales del frontend: registro, login, catálogo, carrito y checkout
 * Las respuestas de la API se simulan para que las pruebas no dependan del backend real ni de Supabase.
 *
 * @author Viktoriia Bohoslavska
 */

import { test, expect } from '@playwright/test'

const product = {
  id: 1,
  nombre: 'Darth Vader',
  precioOriginalSinIVA: 20,
  precioOriginalConIVA: 24.2,
  enOferta: true,
  descuento: 10,
  fechaFinOferta: '2099-01-01',
  precioFinalSinIVA: 18,
  precioFinalConIVA: 21.78,
  iva: 21,
  stock: 5,
  imagen: null,
  descripcion: 'Figura coleccionable de Darth Vader',
  activo: true,
  idCategoria: 1,
  nombreCategoria: 'Star Wars',
  nombreCategoriaPadre: 'Películas'
}

const categories = [
  { id: 1, nombre: 'Star Wars', categoriaPadre: null },
  { id: 2, nombre: 'Marvel', categoriaPadre: null }
]

const cartResponse = {
  items: [
    {
      idProducto: 1,
      producto: 'Darth Vader',
      precioUnitarioSinIVA: 18,
      precioUnitarioConIVA: 21.78,
      ivaPorcentaje: 21,
      cantidad: 1,
      stock: 5,
      image: null
    }
  ]
}

const pageResponse = {
  content: [product],
  totalPages: 1,
  totalElements: 1,
  number: 0,
  size: 100,
  first: true,
  last: true
}

async function fulfillJson(route, data, status = 200) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(data)
  })
}

async function mockApi(page) {
  await page.route('**/api/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const path = url.pathname.replace('/api', '')
    const method = request.method()

    if (path === '/auth/register' && method === 'POST') {
      return fulfillJson(route, { message: 'Cuenta creada correctamente' }, 201)
    }
    if (path === '/auth/login' && method === 'POST') {
      return fulfillJson(route, {
        token: 'token-e2e',
        username: 'ana@test.com',
        name: 'Ana',
        role: 'CLIENTE'
      })
    }
    if (path === '/productos/ofertas') {
      return fulfillJson(route, pageResponse)
    }
    if (path === '/productos/1') {
      return fulfillJson(route, product)
    }
    if (path === '/productos/') {
      return fulfillJson(route, pageResponse)
    }
    if (path === '/categorias/') {
      return fulfillJson(route, categories)
    }
    if (path === '/carrito/' && method === 'GET') {
      return fulfillJson(route, cartResponse)
    }
    if (path.startsWith('/carrito/') && ['POST', 'PUT', 'DELETE'].includes(method)) {
      return fulfillJson(route, cartResponse)
    }
    if (path === '/usuario/perfil' && method === 'GET') {
      return fulfillJson(route, {
        nombre: 'Ana',
        apellido1: 'García',
        apellido2: '',
        email: 'ana@test.com',
        telefono: '600123456'
      })
    }
    if (path === '/usuario/perfil' && method === 'PUT') {
      return fulfillJson(route, { message: 'Perfil actualizado' })
    }
    if (path === '/usuario/direcciones/' && method === 'GET') {
      return fulfillJson(route, [])
    }
    if (path === '/usuario/direcciones/' && method === 'POST') {
      return fulfillJson(route, {
        idDireccion: 10,
        calle: 'Calle Mayor',
        numero: '12',
        piso: '',
        puerta: '',
        ciudad: 'Murcia',
        municipio: 'Murcia',
        provincia: 'Murcia',
        codigoPostal: '30001',
        activo: true
      }, 201)
    }
    if (path === '/metodos-pago/') {
      return fulfillJson(route, [
        { id: 1, nombre: 'Tarjeta bancaria', activo: true }
      ])
    }
    if (path === '/pedidos/crear-desde-pedido' && method === 'POST') {
      return fulfillJson(route, {
        idPedido: 20,
        codigoPedido: 'FM-E2E-001',
        mensaje: 'Pedido confirmado correctamente.'
      }, 201)
    }
    if (path === '/usuario/lista-deseos/') {
      return fulfillJson(route, [])
    }
    if (path === '/usuario/notificaciones/') {
      return fulfillJson(route, [])
    }

    return fulfillJson(route, {})
  })
}

test.beforeEach(async ({ page }) => {
  await mockApi(page)
})

test('registro de usuario', async ({ page }) => {
  await page.goto('/registro')
  await page.getByPlaceholder('Introduce tu email').fill('ana@test.com')
  await page.getByPlaceholder('Introduce tu nombre').fill('Ana María')
  await page.getByPlaceholder('Introduce tu contraseña').fill('Password123')
  await page.getByPlaceholder('Repite tu contraseña').fill('Password123')
  await page.getByRole('button', { name: 'Crear cuenta' }).click()
  await expect(page).toHaveURL(/\/login$/)
})

test('inicio de sesión de usuario', async ({ page }) => {
  await page.goto('/login')
  await page.getByPlaceholder('Introduce tu email').fill('ana@test.com')
  await page.getByPlaceholder('Introduce tu contraseña').fill('Password123')
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()
  await expect(page).toHaveURL('http://localhost:5173/')
  await expect(page.evaluate(() => localStorage.getItem('token'))).resolves.toBe('token-e2e')
})

test('catálogo: carga productos y permite búsqueda', async ({ page }) => {
  await page.goto('/catalogo')
  const productCard = page.getByRole('article').filter({ hasText: 'Darth Vader' })
  await expect(productCard).toBeVisible()
  await expect(productCard.getByText('Star Wars')).toBeVisible()
  await page.getByPlaceholder('Barra de búsqueda').fill('Darth')
  await expect(productCard).toBeVisible()
})

test('carrito: añade producto desde catálogo y muestra resumen', async ({ page }) => {
  await page.goto('/catalogo')
  await page.getByRole('button', { name: 'Añadir' }).first().click()
  await page.goto('/carrito')
  await expect(page.getByText('Darth Vader')).toBeVisible()
  await expect(page.getByText('Total con IVA')).toBeVisible()
})

test('checkout: guarda dirección, simula pago y confirma pedido', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'token-e2e')
    localStorage.setItem('username', 'ana@test.com')
    localStorage.setItem('name', 'Ana')
    localStorage.setItem('role', 'CLIENTE')
  })

  await page.goto('/checkout')
  await expect(page.getByText('Información personal')).toBeVisible()
  await expect(page.getByText('Darth Vader')).toBeVisible()
  await page.getByLabel('Calle').fill('Calle Mayor')
  await page.getByLabel('Número').fill('12')
  await page.getByLabel('Ciudad').fill('Murcia')
  await page.getByLabel('Municipio').fill('Murcia')
  await page.getByLabel('Provincia').fill('Murcia')
  await page.getByPlaceholder('Ej. 30001').fill('30001')
  await page.getByRole('button', { name: 'Guardar dirección' }).click()
  await expect(page.getByText('Dirección guardada y seleccionada para este pedido.')).toBeVisible()
  await page.getByPlaceholder('Titular de la tarjeta').fill('Ana García')
  await page.getByPlaceholder('Número de tarjeta, 16 dígitos').fill('4111111111111111')
  await page.getByPlaceholder('MM/AA').fill('12/30')
  await page.getByPlaceholder('CVV').fill('123')
  await page.getByRole('button', { name: 'Comprar' }).click()
  await expect(page.getByRole('heading', { name: 'Pedido confirmado' })).toBeVisible()
  await expect(page.getByText('FM-E2E-001')).toBeVisible()
})