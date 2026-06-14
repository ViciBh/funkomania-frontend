/**
 * Pruebas unitarias del servicio de categorías
 * Este archivo comprueba que las categorías recibidas desde backend se adaptan correctamente al formato utilizado por el frontend.
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

import { getCategories } from '@/services/categoryService'

describe('categoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('obtiene y adapta categorías sin categoría padre', async () => {
    apiMocks.apiRequest.mockResolvedValue([
      { id: 1, nombre: 'Marvel', categoriaPadre: null }
    ])
    const categories = await getCategories()
    expect(apiMocks.apiRequest).toHaveBeenCalledWith('/categorias/')
    expect(categories).toEqual([
      {
        idCategoria: 1,
        Nombre: 'Marvel',
        CategoriaPadre: null
      }
    ])
  })

  it('adapta categoría padre cuando llega como número', async () => {
    apiMocks.apiRequest.mockResolvedValue([
      { id: 2, nombre: 'Spider-Man', categoriaPadre: 1 }
    ])
    const categories = await getCategories()
    expect(categories[0].CategoriaPadre).toBe(1)
  })

  it('adapta categoría padre cuando llega como objeto', async () => {
    apiMocks.apiRequest.mockResolvedValue([
      { id: 3, nombre: 'Iron Man', categoriaPadre: { id: 1 } }
    ])
    const categories = await getCategories()
    expect(categories[0]).toEqual({
      idCategoria: 3,
      Nombre: 'Iron Man',
      CategoriaPadre: 1
    })
  })

  it('adapta categorías con nombres de campos alternativos', async () => {
    apiMocks.apiRequest.mockResolvedValue([
      { idCategoria: 4, Nombre: 'Anime', CategoriaPadre: { idCategoria: 2 } }
    ])
    const categories = await getCategories()
    expect(categories[0]).toEqual({
      idCategoria: 4,
      Nombre: 'Anime',
      CategoriaPadre: 2
    })
  })
})