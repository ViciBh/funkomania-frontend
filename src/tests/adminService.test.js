/**
 * Pruebas unitarias del servicio de administración.
 * Comprueba que las operaciones principales del panel de administración llaman a los endpoints correctos del backend.
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

const apiMocks = vi.hoisted(() => ({ apiRequest: vi.fn() }))

vi.mock('@/services/api', () => ({ apiRequest: apiMocks.apiRequest }))

import {
  getAdminStockAlerts,
  getAdminUsers,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  getAdminOrders,
  getAdminOrderDetail,
  createAdminOrder,
  updateAdminOrder,
  addAdminOrderLine,
  updateAdminOrderLine,
  deleteAdminOrderLine
} from '@/services/adminService'

describe('adminService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('consulta alertas de stock', async () => {
    await getAdminStockAlerts()
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/admin/alertas-stock/')
  })

  it('consulta usuarios con búsqueda', async () => {
    await getAdminUsers('ana')
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/admin/usuarios/?search=ana')
  })

  it('consulta productos con búsqueda', async () => {
    await getAdminProducts('vader')
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/admin/productos/?search=vader')
  })

  it('crea, actualiza y elimina productos', async () => {
    const product = { Nombre: 'Producto test' }
    await createAdminProduct(product)
    await updateAdminProduct(1, product)
    await deleteAdminProduct(1)
    expect(apiMocks.apiRequest).toHaveBeenNthCalledWith(1, '/admin/productos/', { method: 'POST', body: JSON.stringify(product) })
    expect(apiMocks.apiRequest).toHaveBeenNthCalledWith(2, '/admin/productos/1', { method: 'PUT', body: JSON.stringify(product) })
    expect(apiMocks.apiRequest).toHaveBeenNthCalledWith(3, '/admin/productos/1', { method: 'DELETE' })
  })

  it('gestiona categorías desde administración', async () => {
    const category = { Nombre: 'Marvel' }
    await getAdminCategories()
    await createAdminCategory(category)
    await updateAdminCategory(2, category)
    await deleteAdminCategory(2)
    expect(apiMocks.apiRequest).toHaveBeenNthCalledWith(1, '/admin/categorias/')
    expect(apiMocks.apiRequest).toHaveBeenNthCalledWith(2, '/admin/categorias/', { method: 'POST', body: JSON.stringify(category) })
    expect(apiMocks.apiRequest).toHaveBeenNthCalledWith(3, '/admin/categorias/2', { method: 'PUT', body: JSON.stringify(category) })
    expect(apiMocks.apiRequest).toHaveBeenNthCalledWith(4, '/admin/categorias/2', { method: 'DELETE' })
  })

  it('gestiona pedidos y líneas de pedido', async () => {
    const order = { EstadoPedido: 'PENDIENTE' }
    const line = { idProducto: 5, cantidad: 2 }
    await getAdminOrders({ estado: 'PENDIENTE' })
    await getAdminOrderDetail(3)
    await createAdminOrder(order)
    await updateAdminOrder(3, order)
    await addAdminOrderLine(3, line)
    await updateAdminOrderLine(3, 5, line)
    await deleteAdminOrderLine(3, 5)
    expect(apiMocks.apiRequest).toHaveBeenNthCalledWith(1, '/admin/pedidos/?estado=PENDIENTE')
    expect(apiMocks.apiRequest).toHaveBeenNthCalledWith(2, '/admin/pedidos/3')
    expect(apiMocks.apiRequest).toHaveBeenNthCalledWith(3, '/admin/pedidos/', { method: 'POST', body: JSON.stringify(order) })
    expect(apiMocks.apiRequest).toHaveBeenNthCalledWith(4, '/admin/pedidos/3', { method: 'PUT', body: JSON.stringify(order) })
    expect(apiMocks.apiRequest).toHaveBeenNthCalledWith(5, '/admin/pedidos/3/lineas', { method: 'POST', body: JSON.stringify(line) })
    expect(apiMocks.apiRequest).toHaveBeenNthCalledWith(6, '/admin/pedidos/3/lineas/5', { method: 'PUT', body: JSON.stringify(line) })
    expect(apiMocks.apiRequest).toHaveBeenNthCalledWith(7, '/admin/pedidos/3/lineas/5', { method: 'DELETE' })
  })
})