/**
 * Pruebas unitarias del servicio de productos
 * Este archivo comprueba la comunicación del servicio de productos con la API, el uso de filtros y la adaptación de datos recibidos desde backend al formato utilizado por las vistas del frontend.
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

const apiMocks = vi.hoisted(() => ({
  apiRequest: vi.fn()
}))

vi.mock('@/services/api', () => ({
  apiRequest: apiMocks.apiRequest
}))

import { getProducts, getOfferProducts, getProductById, getProductsList } from '@/services/productService'

const backendProduct = {
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
  imagen: 'darth-vader.png',
  descripcion: 'Figura Darth Vader',
  activo: true,
  idCategoria: 2,
  nombreCategoria: 'Star Wars',
  nombreCategoriaPadre: 'Películas'
}

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('obtiene productos con filtros y adapta los datos', async () => {
    apiMocks.apiRequest.mockResolvedValue({
      content: [backendProduct],
      totalPages: 1,
      totalElements: 1,
      number: 0,
      size: 20,
      first: true,
      last: true
    })

    const result = await getProducts({
      page: 0,
      size: 20,
      search: 'Darth',
      idCategoria: 2,
      precioMin: 10,
      precioMax: 30,
      oferta: true
    })

    const endpoint = apiMocks.apiRequest.mock.calls[0][0]
    expect(endpoint).toContain('/productos/?')
    expect(endpoint).toContain('page=0')
    expect(endpoint).toContain('size=20')
    expect(endpoint).toContain('search=Darth')
    expect(endpoint).toContain('idCategoria=2')
    expect(endpoint).toContain('precioMin=10')
    expect(endpoint).toContain('precioMax=30')
    expect(endpoint).toContain('oferta=true')
    expect(result.products[0]).toEqual({
      idProducto: 1,
      Nombre: 'Darth Vader',
      PrecioOriginal_SinIVA: 20,
      PrecioOriginal_ConIVA: 24.2,
      EnOferta: 1,
      Descuento: 10,
      FechaFinOferta: '2099-01-01',
      PrecioFinal_SinIVA: 18,
      PrecioFinal_ConIVA: 21.78,
      iva: 21,
      Stock: 5,
      Image: 'darth-vader.png',
      Descripcion: 'Figura Darth Vader',
      Activo: 1,
      idCategoria: 2,
      NombreCategoria: 'Star Wars',
      NombreCategoriaPadre: 'Películas',
      Precio: 18
    })
  })

  it('obtiene productos en oferta', async () => {
    apiMocks.apiRequest.mockResolvedValue({
      content: [backendProduct],
      totalPages: 1,
      totalElements: 1,
      number: 0,
      size: 20,
      first: true,
      last: true
    })
    const result = await getOfferProducts({ search: 'Darth' })
    expect(apiMocks.apiRequest.mock.calls[0][0]).toContain('/productos/ofertas?')
    expect(apiMocks.apiRequest.mock.calls[0][0]).toContain('search=Darth')
    expect(result.products).toHaveLength(1)
    expect(result.products[0].EnOferta).toBe(1)
  })

  it('obtiene el detalle de un producto por id', async () => {
    apiMocks.apiRequest.mockResolvedValue(backendProduct)
    const product = await getProductById(1)
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/productos/1')
    expect(product.idProducto).toBe(1)
    expect(product.Nombre).toBe('Darth Vader')
  })

  it('obtiene varias páginas de productos en formato lista', async () => {
    apiMocks.apiRequest
      .mockResolvedValueOnce({
        content: [{ ...backendProduct, id: 1, nombre: 'Darth Vader' }],
        totalPages: 2,
        totalElements: 2,
        number: 0,
        size: 100,
        first: true,
        last: false
      })
      .mockResolvedValueOnce({
        content: [{ ...backendProduct, id: 2, nombre: 'Iron Man' }],
        totalPages: 2,
        totalElements: 2,
        number: 1,
        size: 100,
        first: false,
        last: true
      })
    const products = await getProductsList()
    expect(products).toHaveLength(2)
    expect(products[0].Nombre).toBe('Darth Vader')
    expect(products[1].Nombre).toBe('Iron Man')
    expect(apiMocks.apiRequest).toHaveBeenCalledTimes(2)
  })
})