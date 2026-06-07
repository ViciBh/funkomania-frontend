/**
 * Servicio de productos del frontend de Funkomanía.
 * Conecta el catálogo, ofertas y detalle de producto con la API backend.
 *
 * @author Viktoriia Bohoslavska
 */

import { apiRequest } from './api'

/**
 * Adapta un producto recibido del backend al formato usado por el frontend.
 *
 * @param {Object} product Producto recibido desde la API backend.
 * @returns {Object} Producto adaptado al formato del frontend.
 */
function mapProductFromBackend(product) {
  return {
    idProducto: product.id,
    Nombre: product.nombre,
    PrecioOriginal_SinIVA: Number(product.precioOriginalSinIVA || 0),
    PrecioOriginal_ConIVA: Number(product.precioOriginalConIVA || 0),
    EnOferta: product.enOferta ? 1 : 0,
    Descuento: Number(product.descuento || 0),
    FechaFinOferta: product.fechaFinOferta,
    PrecioFinal_SinIVA: Number(product.precioFinalSinIVA || 0),
    PrecioFinal_ConIVA: Number(product.precioFinalConIVA || 0),
    iva: Number(product.iva ?? 0),
    Stock: Number(product.stock || 0),
    Image: product.imagen,
    Descripcion: product.descripcion,
    Activo: product.activo ? 1 : 0,
    idCategoria: product.idCategoria,
    NombreCategoria: product.nombreCategoria,
    NombreCategoriaPadre: product.nombreCategoriaPadre,
    Precio: Number(product.precioFinalSinIVA ?? product.precioOriginalSinIVA ?? 0)
  }
}

/**
 * Obtiene una página de productos del catálogo desde el backend.
 *
 * @param {Object} filters Filtros opcionales del catálogo.
 * @returns {Promise<Object>} Página de productos adaptada al frontend.
 */
export async function getProducts(filters = {}) {
  const params = new URLSearchParams()

  params.append('page', filters.page ?? 0)
  params.append('size', filters.size ?? 20)

  if (filters.search) params.append('search', filters.search)
  if (filters.idCategoria) params.append('idCategoria', filters.idCategoria)
  if (filters.precioMin) params.append('precioMin', filters.precioMin)
  if (filters.precioMax) params.append('precioMax', filters.precioMax)
  if (filters.oferta !== undefined) params.append('oferta', filters.oferta)

  const data = await apiRequest(`/productos/?${params.toString()}`)

  return {
    products: (data.content || []).map(mapProductFromBackend),
    totalPages: data.totalPages || 0,
    totalElements: data.totalElements || 0,
    page: data.number || 0,
    size: data.size || Number(filters.size || 20),
    first: data.first ?? true,
    last: data.last ?? true
  }
}

/**
 * Obtiene todos los productos en formato lista.
 * Se usa en vistas donde la paginación y los filtros se gestionan desde el frontend.
 *
 * @returns {Promise<Array>} Lista completa de productos adaptados.
 */
export async function getProductsList() {
  const firstPage = await getProducts({ page: 0, size: 100 })
  const allProducts = [...firstPage.products]

  for (let page = 1; page < firstPage.totalPages; page++) {
    const nextPage = await getProducts({ page, size: 100 })
    allProducts.push(...nextPage.products)
  }

  return allProducts
}

/**
 * Obtiene una página de productos en oferta desde el backend.
 *
 * @param {Object} filters Filtros opcionales de ofertas.
 * @returns {Promise<Object>} Página de productos en oferta adaptada.
 */
export async function getOfferProducts(filters = {}) {
  const params = new URLSearchParams()

  params.append('page', filters.page ?? 0)
  params.append('size', filters.size ?? 20)

  if (filters.search) params.append('search', filters.search)
  if (filters.idCategoria) params.append('idCategoria', filters.idCategoria)
  if (filters.precioMin) params.append('precioMin', filters.precioMin)
  if (filters.precioMax) params.append('precioMax', filters.precioMax)

  const data = await apiRequest(`/productos/ofertas?${params.toString()}`)

  return {
    products: (data.content || []).map(mapProductFromBackend),
    totalPages: data.totalPages || 0,
    totalElements: data.totalElements || 0,
    page: data.number || 0,
    size: data.size || Number(filters.size || 20),
    first: data.first ?? true,
    last: data.last ?? true
  }
}

/**
 * Obtiene todos los productos en oferta en formato lista.
 * Se puede usar si una vista necesita filtrar ofertas desde el frontend.
 *
 * @returns {Promise<Array>} Lista completa de productos en oferta adaptados.
 */
export async function getOfferProductsList() {
  const firstPage = await getOfferProducts({ page: 0, size: 100 })
  const allProducts = [...firstPage.products]

  for (let page = 1; page < firstPage.totalPages; page++) {
    const nextPage = await getOfferProducts({ page, size: 100 })
    allProducts.push(...nextPage.products)
  }

  return allProducts
}

/**
 * Obtiene el detalle de un producto concreto desde el backend.
 *
 * @param {number|string} idProducto Identificador del producto.
 * @returns {Promise<Object>} Producto adaptado al formato del frontend.
 */
export async function getProductById(idProducto) {
  const data = await apiRequest(`/productos/${idProducto}`)

  return mapProductFromBackend(data)
}