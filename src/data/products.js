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

function getCategoryPath(idCategoria) {
  const path = []
  let current = getCategoryById(idCategoria)

  while (current) {
    path.unshift(current.Nombre)
    current = getCategoryById(current.CategoriaPadre)
  }

  return path
}

function getCategoryPathIds(idCategoria) {
  const path = []
  let current = getCategoryById(idCategoria)

  while (current) {
    path.unshift(current.idCategoria)
    current = getCategoryById(current.CategoriaPadre)
  }

  return path
}

function mapProduct(product) {
  const category = getCategoryById(product.idCategoria)
  const parentCategory = category?.CategoriaPadre ? getCategoryById(category.CategoriaPadre) : null

  return {
    ...product,
    NombreCategoria: category?.Nombre || '',
    NombreCategoriaPadre: parentCategory?.Nombre || null,
    CategoriaPath: getCategoryPath(product.idCategoria),
    CategoriaPathIds: getCategoryPathIds(product.idCategoria)
  }
}

const baseProducts = [
  {
    idProducto: 1,
    Nombre: 'Funko Pop Tanjiro Kamado',
    Precio: 16.99,
    Stock: 12,
    Image: tanjiroImg,
    Descripcion: 'Figura coleccionable de Tanjiro Kamado inspirada en Demon Slayer.',
    idCategoria: 8,
    iva: 21,
    Activo: 1,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null
  },
  {
    idProducto: 2,
    Nombre: 'Funko Pop Spider-Man',
    Precio: 17.99,
    Stock: 8,
    Image: spidermanImg,
    Descripcion: 'Figura de Spider-Man ideal para fans del universo Marvel.',
    idCategoria: 3,
    iva: 21,
    Activo: 1,
    EnOferta: 1,
    Descuento: 22,
    FechaFinOferta: '2026-12-31'
  },
  {
    idProducto: 3,
    Nombre: 'Funko Pop Darth Vader',
    Precio: 18.99,
    Stock: 5,
    Image: darthVaderImg,
    Descripcion: 'Figura de Darth Vader, uno de los personajes más icónicos de Star Wars.',
    idCategoria: 19,
    iva: 21,
    Activo: 1,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null
  },
  {
    idProducto: 4,
    Nombre: 'Funko Pop Harry Potter',
    Precio: 15.99,
    Stock: 10,
    Image: harryPotterImg,
    Descripcion: 'Figura de Harry Potter con detalles inspirados en la saga mágica.',
    idCategoria: 18,
    iva: 21,
    Activo: 1,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null
  },
  {
    idProducto: 5,
    Nombre: 'Funko Pop Pikachu',
    Precio: 19.99,
    Stock: 0,
    Image: pikachuImg,
    Descripcion: 'Figura de Pikachu para coleccionistas y fans de Pokémon.',
    idCategoria: 11,
    iva: 21,
    Activo: 1,
    EnOferta: 1,
    Descuento: 25,
    FechaFinOferta: '2026-12-31'
  },
  {
    idProducto: 6,
    Nombre: 'Funko Pop Stitch',
    Precio: 12.99,
    Stock: 15,
    Image: stitchImg,
    Descripcion: 'Figura de Stitch con estilo divertido y adorable.',
    idCategoria: 13,
    iva: 21,
    Activo: 1,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null
  },
  {
    idProducto: 7,
    Nombre: 'Funko Pop Iron Man',
    Precio: 21.99,
    Stock: 6,
    Image: ironManImg,
    Descripcion: 'Figura de Iron Man basada en el universo de los Avengers.',
    idCategoria: 4,
    iva: 21,
    Activo: 1,
    EnOferta: 1,
    Descuento: 18,
    FechaFinOferta: '2026-12-31'
  },
  {
    idProducto: 8,
    Nombre: 'Funko Pop Batman',
    Precio: 16.49,
    Stock: 9,
    Image: batmanImg,
    Descripcion: 'Figura de Batman para fans de DC Comics.',
    idCategoria: 15,
    iva: 21,
    Activo: 1,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null
  },
  {
    idProducto: 9,
    Nombre: 'Funko Pop Naruto Uzumaki',
    Precio: 15.49,
    Stock: 11,
    Image: narutoImg,
    Descripcion: 'Figura de Naruto Uzumaki inspirada en el anime Naruto.',
    idCategoria: 9,
    iva: 21,
    Activo: 1,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null
  },
  {
    idProducto: 10,
    Nombre: 'Funko Pop Wednesday Addams',
    Precio: 22.99,
    Stock: 4,
    Image: wednesdayImg,
    Descripcion: 'Figura de Wednesday Addams con estética oscura y elegante.',
    idCategoria: 17,
    iva: 21,
    Activo: 1,
    EnOferta: 1,
    Descuento: 20,
    FechaFinOferta: '2026-12-31'
  },
  {
    idProducto: 11,
    Nombre: 'Funko Pop Groot',
    Precio: 13.49,
    Stock: 14,
    Image: grootImg,
    Descripcion: 'Figura de Groot, personaje de Guardians of the Galaxy.',
    idCategoria: 6,
    iva: 21,
    Activo: 1,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null
  },
  {
    idProducto: 12,
    Nombre: 'Funko Pop Doctor Strange',
    Precio: 20.99,
    Stock: 3,
    Image: null,
    Descripcion: 'Figura de Doctor Strange dentro de la colección Avengers de Marvel.',
    idCategoria: 5,
    iva: 21,
    Activo: 1,
    EnOferta: 1,
    Descuento: 15,
    FechaFinOferta: null
  },
  {
    idProducto: 13,
    Nombre: 'Funko Pop Spider-Man Edición Antigua',
    Precio: 24.99,
    Stock: 7,
    Image: spidermanImg,
    Descripcion: 'Producto con oferta caducada para comprobar que el descuento no se aplica.',
    idCategoria: 3,
    iva: 21,
    Activo: 1,
    EnOferta: 1,
    Descuento: 30,
    FechaFinOferta: '2024-12-31'
  },
  {
    idProducto: 14,
    Nombre: 'Funko Pop Loki Archivado',
    Precio: 18.49,
    Stock: 2,
    Image: ironManImg,
    Descripcion: 'Producto inactivo para comprobar que no aparece en el catálogo público.',
    idCategoria: 2,
    iva: 21,
    Activo: 0,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null
  }
]

export const products = baseProducts.map(mapProduct)

export function isOfertaActiva(product) {
  if (product.EnOferta !== 1 || product.Descuento <= 0) {
    return false
  }
  if (!product.FechaFinOferta) {
    return true
  }
  return new Date(product.FechaFinOferta) >= new Date()
}

export function getPrecioConDescuento(product) {
  if (isOfertaActiva(product)) {
    return Number((product.Precio - product.Precio * product.Descuento / 100).toFixed(2))
  }
  return product.Precio
}

export function getPrecioConIva(price, iva) {
  return Number((price * (1 + iva / 100)).toFixed(2))
}

export function productMatchesCategory(product, categoryName) {
  if (!categoryName) {
    return true
  }
  return product.CategoriaPath.includes(categoryName)
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