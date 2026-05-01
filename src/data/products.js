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
    id: 1,
    name: 'Funko Pop Tanjiro Kamado',
    category: 'Anime',
    saga: 'Demon Slayer',
    price: 16.99,
    oldPrice: null,
    stock: 12,
    isNew: true,
    isOffer: false,
    discount: 0,
    image: tanjiroImg,
    description: 'Figura coleccionable de Tanjiro Kamado inspirada en Demon Slayer.'
  },
  {
    id: 2,
    name: 'Funko Pop Spider-Man',
    category: 'Marvel',
    saga: 'Spider-Man',
    price: 13.99,
    oldPrice: 17.99,
    stock: 8,
    isNew: false,
    isOffer: true,
    discount: 22,
    image: spidermanImg,
    description: 'Figura de Spider-Man ideal para fans del universo Marvel.'
  },
  {
    id: 3,
    name: 'Funko Pop Darth Vader',
    category: 'Star Wars',
    saga: 'Star Wars',
    price: 18.99,
    oldPrice: null,
    stock: 5,
    isNew: false,
    isOffer: false,
    discount: 0,
    image: darthVaderImg,
    description: 'Figura de Darth Vader, uno de los personajes más icónicos de Star Wars.'
  },
  {
    id: 4,
    name: 'Funko Pop Harry Potter',
    category: 'Harry Potter',
    saga: 'Harry Potter',
    price: 15.99,
    oldPrice: null,
    stock: 10,
    isNew: true,
    isOffer: false,
    discount: 0,
    image: harryPotterImg,
    description: 'Figura de Harry Potter con detalles inspirados en la saga mágica.'
  },
  {
    id: 5,
    name: 'Funko Pop Pikachu',
    category: 'Videojuegos',
    saga: 'Pokémon',
    price: 14.99,
    oldPrice: 19.99,
    stock: 0,
    isNew: false,
    isOffer: true,
    discount: 25,
    image: pikachuImg,
    description: 'Figura de Pikachu para coleccionistas y fans de Pokémon.'
  },
  {
    id: 6,
    name: 'Funko Pop Stitch',
    category: 'Disney',
    saga: 'Lilo & Stitch',
    price: 12.99,
    oldPrice: null,
    stock: 15,
    isNew: false,
    isOffer: false,
    discount: 0,
    image: stitchImg,
    description: 'Figura de Stitch con estilo divertido y adorable.'
  },
  {
    id: 7,
    name: 'Funko Pop Iron Man',
    category: 'Marvel',
    saga: 'Avengers',
    price: 17.99,
    oldPrice: 21.99,
    stock: 6,
    isNew: false,
    isOffer: true,
    discount: 18,
    image: ironManImg,
    description: 'Figura de Iron Man basada en el universo de los Avengers.'
  },
  {
    id: 8,
    name: 'Funko Pop Batman',
    category: 'DC',
    saga: 'Batman',
    price: 16.49,
    oldPrice: null,
    stock: 9,
    isNew: false,
    isOffer: false,
    discount: 0,
    image: batmanImg,
    description: 'Figura de Batman para fans de DC Comics.'
  },
  {
    id: 9,
    name: 'Funko Pop Naruto Uzumaki',
    category: 'Anime',
    saga: 'Naruto',
    price: 15.49,
    oldPrice: null,
    stock: 11,
    isNew: true,
    isOffer: false,
    discount: 0,
    image: narutoImg,
    description: 'Figura de Naruto Uzumaki inspirada en el anime Naruto.'
  },
  {
    id: 10,
    name: 'Funko Pop Wednesday Addams',
    category: 'Series',
    saga: 'Wednesday',
    price: 18.49,
    oldPrice: 22.99,
    stock: 4,
    isNew: false,
    isOffer: true,
    discount: 20,
    image: wednesdayImg,
    description: 'Figura de Wednesday Addams con estética oscura y elegante.'
  },
  {
    id: 11,
    name: 'Funko Pop Groot',
    category: 'Marvel',
    saga: 'Guardians of the Galaxy',
    price: 13.49,
    oldPrice: null,
    stock: 14,
    isNew: false,
    isOffer: false,
    discount: 0,
    image: grootImg,
    description: 'Figura de Groot, personaje de Guardians of the Galaxy.'
  }
]