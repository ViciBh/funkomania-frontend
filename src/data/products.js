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

export const products = [
  {
    idProducto: 1,
    Nombre: 'Funko Pop Tanjiro Kamado',
    Precio: 16.99,
    Stock: 12,
    Image: tanjiroImg,
    Descripcion: 'Figura coleccionable de Tanjiro Kamado inspirada en Demon Slayer.',
    idCategoria: 1,
    NombreCategoria: 'Demon Slayer',
    NombreCategoriaPadre: 'Anime',
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
    idCategoria: 2,
    NombreCategoria: 'Spider-Man',
    NombreCategoriaPadre: 'Marvel',
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
    idCategoria: 3,
    NombreCategoria: 'Star Wars',
    NombreCategoriaPadre: null,
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
    idCategoria: 4,
    NombreCategoria: 'Harry Potter',
    NombreCategoriaPadre: null,
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
    idCategoria: 5,
    NombreCategoria: 'Pokémon',
    NombreCategoriaPadre: 'Videojuegos',
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
    idCategoria: 6,
    NombreCategoria: 'Lilo & Stitch',
    NombreCategoriaPadre: 'Disney',
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
    idCategoria: 7,
    NombreCategoria: 'Avengers',
    NombreCategoriaPadre: 'Marvel',
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
    idCategoria: 8,
    NombreCategoria: 'Batman',
    NombreCategoriaPadre: 'DC',
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
    NombreCategoria: 'Naruto',
    NombreCategoriaPadre: 'Anime',
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
    idCategoria: 10,
    NombreCategoria: 'Wednesday',
    NombreCategoriaPadre: 'Series',
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
    idCategoria: 11,
    NombreCategoria: 'Guardians of the Galaxy',
    NombreCategoriaPadre: 'Marvel',
    iva: 21,
    Activo: 1,
    EnOferta: 0,
    Descuento: 0,
    FechaFinOferta: null
  }
]

export function getPrecioConDescuento(product) {
  if (product.EnOferta === 1 && product.Descuento > 0) {
    return Number((product.Precio - product.Precio * product.Descuento / 100).toFixed(2))
  }

  return product.Precio
}

export function getPrecioConIva(price, iva) {
  return Number((price * (1 + iva / 100)).toFixed(2))
}