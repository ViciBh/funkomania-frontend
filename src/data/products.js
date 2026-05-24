import tanjiroImg from '@/assets/products/tanjiro.png'
import spidermanImg from '@/assets/products/spiderman.png'
import darthVaderImg from '@/assets/products/darth-vader.png'
import harryPotterImg from '@/assets/products/harry-potter.png'
import pikachuImg from '@/assets/products/pikachu.png'
import stitchImg from '@/assets/products/stitch.png'
import ironManImg from '@/assets/products/iron-man.png'
import batmanImg from '@/assets/products/batman.png'
import narutoImg from '@/assets/products/naruto.png'
import wednesdayImg from '@/assets/products/wednesday.png'
import grootImg from '@/assets/products/groot.png'

/* MOCK DB - Categoria */

export const categories = [
  { idCategoria: 1, Nombre: 'Marvel', CategoriaPadre: null },
  { idCategoria: 2, Nombre: 'Avengers', CategoriaPadre: 1 },
  { idCategoria: 3, Nombre: 'Spider-Man', CategoriaPadre: 2 },
  { idCategoria: 4, Nombre: 'Iron Man', CategoriaPadre: 2 },
  { idCategoria: 5, Nombre: 'Doctor Strange', CategoriaPadre: 2 },
  { idCategoria: 6, Nombre: 'Guardians of the Galaxy', CategoriaPadre: 1 },

  { idCategoria: 7, Nombre: 'Anime', CategoriaPadre: null },
  { idCategoria: 8, Nombre: 'Demon Slayer', CategoriaPadre: 7 },
  { idCategoria: 9, Nombre: 'Naruto', CategoriaPadre: 7 },

  { idCategoria: 10, Nombre: 'Videojuegos', CategoriaPadre: null },
  { idCategoria: 11, Nombre: 'Pokémon', CategoriaPadre: 10 },

  { idCategoria: 12, Nombre: 'Disney', CategoriaPadre: null },
  { idCategoria: 13, Nombre: 'Lilo & Stitch', CategoriaPadre: 12 },

  { idCategoria: 14, Nombre: 'DC', CategoriaPadre: null },
  { idCategoria: 15, Nombre: 'Batman', CategoriaPadre: 14 },

  { idCategoria: 16, Nombre: 'Series', CategoriaPadre: null },
  { idCategoria: 17, Nombre: 'Wednesday', CategoriaPadre: 16 },

  { idCategoria: 18, Nombre: 'Harry Potter', CategoriaPadre: null },
  { idCategoria: 19, Nombre: 'Star Wars', CategoriaPadre: null }
]

function getCategoryById(idCategoria) {
  return categories.find((category) => category.idCategoria === idCategoria)
}

export function getCategoryPath(idCategoria) {
  const path = []
  let current = getCategoryById(idCategoria)
  while (current) {
    path.unshift(current.Nombre)
    current = getCategoryById(current.CategoriaPadre)
  }
  return path
}

export function getCategoryPathText(idCategoria) {
  return getCategoryPath(idCategoria).join(' ')
}

/* MOCK DB - Funciones equivalentes a MySQL */
export function fnPrecioConIva(precio, iva) {
  return Number(precio) * (1 + Number(iva) / 100)
}

export function fnSubtotalLinea(precio, cantidad, iva) {
  return Number(precio) * Number(cantidad) * (1 + Number(iva) / 100)
}

export function fnPrecioConDescuento(precio, enOferta, descuento, fechaFinOferta) {
  if (enOferta === 1 && descuento > 0 && (!fechaFinOferta || new Date(fechaFinOferta) >= new Date())) {
    return Number((Number(precio) - Number(precio) * Number(descuento) / 100).toFixed(2))
  }
  return Number(precio)
}

/* MOCK DB - VProductos_Catalogo */
export const products = [
  {
    idProducto: 1,
    Nombre: 'Funko Pop Tanjiro Kamado',
    PrecioOriginal_SinIVA: 16.99,
    PrecioOriginal_ConIVA: 20.56,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null,
    PrecioFinal_SinIVA: 16.99,
    PrecioFinal_ConIVA: 20.56,
    iva: 21,
    Stock: 12,
    Image: tanjiroImg,
    Descripcion: 'Figura coleccionable de Tanjiro Kamado inspirada en Demon Slayer.',
    Activo: 1,
    idCategoria: 8,
    NombreCategoria: 'Demon Slayer',
    NombreCategoriaPadre: 'Anime',
    Precio: 16.99
  },
  {
    idProducto: 2,
    Nombre: 'Funko Pop Spider-Man',
    PrecioOriginal_SinIVA: 17.99,
    PrecioOriginal_ConIVA: 21.77,
    EnOferta: 1,
    Descuento: 22,
    FechaFinOferta: '2026-12-31',
    PrecioFinal_SinIVA: 14.03,
    PrecioFinal_ConIVA: 16.98,
    iva: 21,
    Stock: 8,
    Image: spidermanImg,
    Descripcion: 'Figura de Spider-Man ideal para fans del universo Marvel.',
    Activo: 1,
    idCategoria: 3,
    NombreCategoria: 'Spider-Man',
    NombreCategoriaPadre: 'Avengers',
    Precio: 14.03
  },
  {
    idProducto: 3,
    Nombre: 'Funko Pop Darth Vader',
    PrecioOriginal_SinIVA: 18.99,
    PrecioOriginal_ConIVA: 22.98,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null,
    PrecioFinal_SinIVA: 18.99,
    PrecioFinal_ConIVA: 22.98,
    iva: 21,
    Stock: 5,
    Image: darthVaderImg,
    Descripcion: 'Figura de Darth Vader, uno de los personajes más icónicos de Star Wars.',
    Activo: 1,
    idCategoria: 19,
    NombreCategoria: 'Star Wars',
    NombreCategoriaPadre: null,
    Precio: 18.99
  },
  {
    idProducto: 4,
    Nombre: 'Funko Pop Harry Potter',
    PrecioOriginal_SinIVA: 15.99,
    PrecioOriginal_ConIVA: 19.35,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null,
    PrecioFinal_SinIVA: 15.99,
    PrecioFinal_ConIVA: 19.35,
    iva: 21,
    Stock: 10,
    Image: harryPotterImg,
    Descripcion: 'Figura de Harry Potter con detalles inspirados en la saga mágica.',
    Activo: 1,
    idCategoria: 18,
    NombreCategoria: 'Harry Potter',
    NombreCategoriaPadre: null,
    Precio: 15.99
  },
  {
    idProducto: 5,
    Nombre: 'Funko Pop Pikachu',
    PrecioOriginal_SinIVA: 19.99,
    PrecioOriginal_ConIVA: 24.19,
    EnOferta: 1,
    Descuento: 25,
    FechaFinOferta: '2026-12-31',
    PrecioFinal_SinIVA: 14.99,
    PrecioFinal_ConIVA: 18.14,
    iva: 21,
    Stock: 0,
    Image: pikachuImg,
    Descripcion: 'Figura de Pikachu para coleccionistas y fans de Pokémon.',
    Activo: 1,
    idCategoria: 11,
    NombreCategoria: 'Pokémon',
    NombreCategoriaPadre: 'Videojuegos',
    Precio: 14.99
  },
  {
    idProducto: 6,
    Nombre: 'Funko Pop Stitch',
    PrecioOriginal_SinIVA: 12.99,
    PrecioOriginal_ConIVA: 15.72,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null,
    PrecioFinal_SinIVA: 12.99,
    PrecioFinal_ConIVA: 15.72,
    iva: 21,
    Stock: 15,
    Image: stitchImg,
    Descripcion: 'Figura de Stitch con estilo divertido y adorable.',
    Activo: 1,
    idCategoria: 13,
    NombreCategoria: 'Lilo & Stitch',
    NombreCategoriaPadre: 'Disney',
    Precio: 12.99
  },
  {
    idProducto: 7,
    Nombre: 'Funko Pop Iron Man',
    PrecioOriginal_SinIVA: 21.99,
    PrecioOriginal_ConIVA: 26.61,
    EnOferta: 1,
    Descuento: 18,
    FechaFinOferta: '2026-12-31',
    PrecioFinal_SinIVA: 18.03,
    PrecioFinal_ConIVA: 21.82,
    iva: 21,
    Stock: 6,
    Image: ironManImg,
    Descripcion: 'Figura de Iron Man basada en el universo de los Avengers.',
    Activo: 1,
    idCategoria: 4,
    NombreCategoria: 'Iron Man',
    NombreCategoriaPadre: 'Avengers',
    Precio: 18.03
  },
  {
    idProducto: 8,
    Nombre: 'Funko Pop Batman',
    PrecioOriginal_SinIVA: 16.49,
    PrecioOriginal_ConIVA: 19.95,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null,
    PrecioFinal_SinIVA: 16.49,
    PrecioFinal_ConIVA: 19.95,
    iva: 21,
    Stock: 9,
    Image: batmanImg,
    Descripcion: 'Figura de Batman para fans de DC Comics.',
    Activo: 1,
    idCategoria: 15,
    NombreCategoria: 'Batman',
    NombreCategoriaPadre: 'DC',
    Precio: 16.49
  },
  {
    idProducto: 9,
    Nombre: 'Funko Pop Naruto Uzumaki',
    PrecioOriginal_SinIVA: 15.49,
    PrecioOriginal_ConIVA: 18.74,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null,
    PrecioFinal_SinIVA: 15.49,
    PrecioFinal_ConIVA: 18.74,
    iva: 21,
    Stock: 11,
    Image: narutoImg,
    Descripcion: 'Figura de Naruto Uzumaki inspirada en el anime Naruto.',
    Activo: 1,
    idCategoria: 9,
    NombreCategoria: 'Naruto',
    NombreCategoriaPadre: 'Anime',
    Precio: 15.49
  },
  {
    idProducto: 10,
    Nombre: 'Funko Pop Wednesday Addams',
    PrecioOriginal_SinIVA: 22.99,
    PrecioOriginal_ConIVA: 27.82,
    EnOferta: 1,
    Descuento: 20,
    FechaFinOferta: '2026-12-31',
    PrecioFinal_SinIVA: 18.39,
    PrecioFinal_ConIVA: 22.25,
    iva: 21,
    Stock: 4,
    Image: wednesdayImg,
    Descripcion: 'Figura de Wednesday Addams con estética oscura y elegante.',
    Activo: 1,
    idCategoria: 17,
    NombreCategoria: 'Wednesday',
    NombreCategoriaPadre: 'Series',
    Precio: 18.39
  },
  {
    idProducto: 11,
    Nombre: 'Funko Pop Groot',
    PrecioOriginal_SinIVA: 13.49,
    PrecioOriginal_ConIVA: 16.32,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null,
    PrecioFinal_SinIVA: 13.49,
    PrecioFinal_ConIVA: 16.32,
    iva: 21,
    Stock: 14,
    Image: grootImg,
    Descripcion: 'Figura de Groot, personaje de Guardians of the Galaxy.',
    Activo: 1,
    idCategoria: 6,
    NombreCategoria: 'Guardians of the Galaxy',
    NombreCategoriaPadre: 'Marvel',
    Precio: 13.49
  },
  {
    idProducto: 12,
    Nombre: 'Funko Pop Doctor Strange',
    PrecioOriginal_SinIVA: 20.99,
    PrecioOriginal_ConIVA: 25.40,
    EnOferta: 1,
    Descuento: 15,
    FechaFinOferta: null,
    PrecioFinal_SinIVA: 17.84,
    PrecioFinal_ConIVA: 21.59,
    iva: 21,
    Stock: 3,
    Image: null,
    Descripcion: 'Figura de Doctor Strange dentro de la colección Avengers de Marvel.',
    Activo: 1,
    idCategoria: 5,
    NombreCategoria: 'Doctor Strange',
    NombreCategoriaPadre: 'Avengers',
    Precio: 17.84
  },
  {
    idProducto: 13,
    Nombre: 'Funko Pop Spider-Man Edición Antigua',
    PrecioOriginal_SinIVA: 24.99,
    PrecioOriginal_ConIVA: 30.24,
    EnOferta: 1,
    Descuento: 30,
    FechaFinOferta: '2024-12-31',
    PrecioFinal_SinIVA: 24.99,
    PrecioFinal_ConIVA: 30.24,
    iva: 21,
    Stock: 7,
    Image: spidermanImg,
    Descripcion: 'Producto con oferta caducada para comprobar que el descuento no se aplica.',
    Activo: 1,
    idCategoria: 3,
    NombreCategoria: 'Spider-Man',
    NombreCategoriaPadre: 'Avengers',
    Precio: 24.99
  },
  {
    idProducto: 14,
    Nombre: 'Funko Pop Loki Archivado',
    PrecioOriginal_SinIVA: 18.49,
    PrecioOriginal_ConIVA: 22.37,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null,
    PrecioFinal_SinIVA: 18.49,
    PrecioFinal_ConIVA: 22.37,
    iva: 21,
    Stock: 2,
    Image: ironManImg,
    Descripcion: 'Producto inactivo para comprobar que no aparece en el catálogo público.',
    Activo: 0,
    idCategoria: 2,
    NombreCategoria: 'Avengers',
    NombreCategoriaPadre: 'Marvel',
    Precio: 18.49
  }
]

/* MOCK DB - VProductos_Ofertas */
export const productosOfertas = products.filter((product) => isOfertaActiva(product) && product.Activo === 1)

/* MOCK DB - VAdmin_Alertas_Stock */
export const adminAlertasStock = products
  .filter((product) => product.Stock <= 10 && product.Activo === 1)
  .map((product) => ({
    idProducto: product.idProducto,
    Nombre: product.Nombre,
    Stock: product.Stock,
    idCategoria: product.idCategoria,
    Prioridad: product.Stock === 0 ? 'Agotado' : product.Stock <= 5 ? 'Critico' : 'Bajo'
  }))

/* HELPERS FRONTEND */

export function isOfertaActiva(product) {
  return product.EnOferta === 1 &&
    product.Descuento > 0 &&
    (!product.FechaFinOferta || new Date(product.FechaFinOferta) >= new Date())
}

export function getPrecioConDescuento(product) {
  return product.PrecioFinal_SinIVA
}

export function getPrecioConIva(price, iva) {
  return Number(fnPrecioConIva(price, iva).toFixed(2))
}

export function getSubtotalLinea(price, cantidad, iva) {
  return Number(fnSubtotalLinea(price, cantidad, iva).toFixed(2))
}

export function getProductPriceInfo(product) {
  return {
    PrecioOriginal_SinIVA: product.PrecioOriginal_SinIVA,
    PrecioOriginal_ConIVA: product.PrecioOriginal_ConIVA,
    PrecioFinal_SinIVA: product.PrecioFinal_SinIVA,
    PrecioFinal_ConIVA: product.PrecioFinal_ConIVA
  }
}

export function productMatchesCategory(product, categoryName) {
  if (!categoryName) {
    return true
  }
  const selectedCategory = categories.find((category) => category.Nombre === categoryName)
  if (!selectedCategory) {
    return false
  }
  return isCategoryOrChild(product.idCategoria, selectedCategory.idCategoria)
}

function isCategoryOrChild(productCategoryId, selectedCategoryId) {
  if (productCategoryId === selectedCategoryId) {
    return true
  }
  const productCategory = categories.find((category) => category.idCategoria === productCategoryId)
  if (!productCategory || productCategory.CategoriaPadre === null) {
    return false
  }
  return isCategoryOrChild(productCategory.CategoriaPadre, selectedCategoryId)
}

// Helper para preparar la imagen del producto.
// Ahora puede recibir una imagen importada del mock data, null, una URL completa,
// una ruta relativa o en el futuro un nombre de archivo recibido desde la BD/API.
export function getProductImage(image) {
  if (!image) { return null }
  if (typeof image !== 'string') { return image }
  if (image.startsWith('http') || image.startsWith('/')) { return image }
  return `${import.meta.env.VITE_API_URL || ''}/images/products/${image}`
}