/**
 * Pruebas unitarias de helpers de productos.
 * 
 * Este archivo comprueba funciones auxiliares utilizadas en el frontend para detectar ofertas activas y preparar rutas de imágenes de productos.
 *
 * @author Viktoriia Bohoslavska
 */

import { describe, it, expect } from 'vitest'
import { isOfertaActiva, getProductImage } from '@/data/products'

describe('products helpers', () => {
  it('detecta una oferta activa', () => {
    // Creamos una fecha futura para simular que la oferta todavía no ha caducado.
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    const product = {
      EnOferta: 1,
      Descuento: 20,
      FechaFinOferta: futureDate.toISOString()
    }
    // La función debe devolver true porque el producto está en oferta,
    // tiene descuento y la fecha de fin todavía es válida.
    expect(isOfertaActiva(product)).toBe(true)
  })

  it('detecta una oferta caducada', () => {
    const product = {
      EnOferta: 1,
      Descuento: 20,
      FechaFinOferta: '2000-01-01'
    }
    // La oferta no debe considerarse activa porque la fecha ya ha pasado.
    expect(isOfertaActiva(product)).toBe(false)
  })

  it('devuelve null si no hay imagen', () => {
    // Si el producto no tiene imagen, el helper debe devolver null.
    expect(getProductImage(null)).toBe(null)
  })

  it('mantiene una URL completa de imagen', () => {
    const url = 'https://example.com/producto.png'

    // Si la imagen ya es una URL completa, no se modifica.
    expect(getProductImage(url)).toBe(url)
  })

  it('prepara la ruta de una imagen recibida por nombre de archivo', () => {
    // Si backend devuelve solo el nombre del archivo, se construye la ruta pública.
    expect(getProductImage('darth-vader.png')).toBe('/images/products/darth-vader.png')
  })
})