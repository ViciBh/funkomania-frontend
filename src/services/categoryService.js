/**
 * Servicio de categorías del frontend de Funkomanía.
 * Conecta la vista de categorías y filtros del catálogo con la API backend.
 *
 * @author Viktoriia Bohoslavska
 */

import { apiRequest } from './api'

/**
 * Obtiene el identificador de la categoría padre recibida desde backend.
 * El backend puede devolver categoriaPadre como objeto, número o null.
 *
 * @param {Object} category Categoría recibida desde la API backend.
 * @returns {number|null} Identificador de la categoría padre o null.
 */
function getParentCategoryId(category) {
  if (!category.categoriaPadre && !category.CategoriaPadre) return null

  const parent = category.categoriaPadre || category.CategoriaPadre

  if (typeof parent === 'number') {
    return parent
  }

  if (parent.id !== undefined) {
    return parent.id
  }

  if (parent.idCategoria !== undefined) {
    return parent.idCategoria
  }

  return null
}

/**
 * Adapta una categoría recibida del backend al formato usado por el frontend.
 *
 * @param {Object} category Categoría recibida desde la API backend.
 * @returns {Object} Categoría adaptada al formato del frontend.
 */
function mapCategoryFromBackend(category) {
  return {
    idCategoria: category.id ?? category.idCategoria,
    Nombre: category.nombre ?? category.Nombre,
    CategoriaPadre: getParentCategoryId(category)
  }
}

/**
 * Obtiene todas las categorías desde el backend.
 *
 * @returns {Promise<Array>} Lista de categorías adaptadas al formato del frontend.
 */
export async function getCategories() {
  const data = await apiRequest('/categorias/')

  return data.map(mapCategoryFromBackend)
}