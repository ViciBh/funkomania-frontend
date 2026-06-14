/* HELPERS FRONTEND */
export function isOfertaActiva(product) {
  return product.EnOferta === 1 &&
    product.Descuento > 0 &&
    (!product.FechaFinOferta || new Date(product.FechaFinOferta) >= new Date())
}

// Helper para preparar la imagen del producto.
// Puede recibir null, una URL completa, una ruta relativa,
// un import local o un nombre de archivo recibido desde la BD/API.
export function getProductImage(image) {
  if (!image) { return null }
  if (typeof image !== 'string') { return image }
  if (image.startsWith('http') || image.startsWith('/')) { return image }
  return `${import.meta.env.VITE_API_URL || ''}/images/products/${image}`
}