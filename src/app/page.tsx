'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

type Product = {
  id: number
  title: string
  price: number
  offerPrice?: number
  image: string
  slug: string
  stock: number
  description: string
}

export default function HomePage() {
  const [categorias, setCategorias] = useState([
    { nombre: 'Bolsas', href: '/categorias/bolsas', imagen: '/images/categorias/bolsashopper.png' },
    { nombre: 'Peluches', href: '/categorias/peluches', imagen: '/images/categorias/peluche mono.png' },
    { nombre: 'Hogar', href: '/categorias/hogar', imagen: '/images/categorias/mesa.png' },
    { nombre: 'Librería', href: '/categorias/libreria', imagen: '/images/categorias/calculadora.png' },
    { nombre: 'Tecnología', href: '/categorias/tecnologia', imagen: '/images/categorias/camara.png' },
    { nombre: 'Juegos', href: '/categorias/juegos', imagen: '/images/categorias/ajedrez.png' },
  ])

  const [productos, setProductos] = useState<Product[]>([
    { id: 1, title: 'Bolsa bandolera', price: 50, image: '/images/productos/bolsa bandolera.png', slug: 'bolsa-bandolera', stock: 12, description: 'Bolsa de cuero auténtico, perfecta para cualquier ocasión.' },
    { id: 2, title: 'Bolso de tela', price: 30, image: '/images/productos/bolsa de tela.png', slug: 'bolso-de-tela', stock: 8, description: 'Bolso de tela resistente y ligero.' },
    { id: 3, title: 'Teclado', price: 80, image: '/images/productos/teclado.png', slug: 'teclado', stock: 5, description: 'Teclado mecánico con switches táctiles.' },
    { id: 4, title: 'Peluche oso', price: 20, image: '/images/productos/peluche oso.png', slug: 'peluche-oso', stock: 15, description: 'Peluche suave y adorable para todas las edades.' },
  ])

  const [ofertas, setOfertas] = useState<Product[]>([
    { id: 5, title: 'Peluche conejo', price: 25, offerPrice: 38, image: '/images/productos/peluche conejo.png', slug: 'peluche-conejo', stock: 8, description: 'Peluche de león, divertido y suave.' },
    { id: 6, title: 'Almohada', price: 40, offerPrice: 28, image: '/images/productos/almohada.png', slug: 'almohada-ergonomica', stock: 10, description: 'Almohada ergonómica para descanso óptimo.' },
    { id: 7, title: 'Auriculares', price: 115, offerPrice: 78, image: '/images/productos/auricular.png', slug: 'auriculares-inalambricos', stock: 15, description: 'Auriculares bluetooth con cancelación de ruido.' },
    { id: 8, title: 'Mesa', price: 80, offerPrice: 68, image: '/images/productos/mesa.png', slug: 'mesa', stock: 10, description: 'Divertido juego de mesa para toda la familia.' },
  ])

  const [sliderImages, setSliderImages] = useState([
    '/images/slider/bolsa de mano.png',
    '/images/slider/lapices de grafito.png',
    '/images/slider/peluche conejo.png',
    '/images/slider/banco.png',
    '/images/slider/juego de mesa.png',
  ])
  const [currentSlide, setCurrentSlide] = useState(0)

  const { addToCart } = useCart()
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])

  useEffect(() => {
    const favs = localStorage.getItem('favorites')
    if (favs) setFavoriteIds(JSON.parse(favs).map((p: Product) => p.id))
  }, [])

  const toggleFavorite = (product: Product) => {
    const favs = localStorage.getItem('favorites')
    let favItems: Product[] = favs ? JSON.parse(favs) : []

    if (favItems.find((p) => p.id === product.id)) {
      favItems = favItems.filter((p) => p.id !== product.id)
      setFavoriteIds((prev) => prev.filter((id) => id !== product.id))
    } else {
      favItems.push(product)
      setFavoriteIds((prev) => [...prev, product.id])
    }

    localStorage.setItem('favorites', JSON.stringify(favItems))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [sliderImages])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)

  return (
    <div className="bg-gray-50 min-h-screen pt-10">
      {sliderImages.length > 0 && (
        <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-white">
          {sliderImages.map((src, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image src={src} alt={`Slide ${index + 1}`} fill className="object-contain" />
            </div>
          ))}

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            ›
          </button>
        </section>
      )}

      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-12">Explora nuestras categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categorias.map((cat) => (
            <Link
              key={cat.nombre}
              href={cat.href}
              className="relative group rounded-lg overflow-hidden shadow-lg cursor-pointer"
            >
              <Image
                src={cat.imagen}
                alt={cat.nombre}
                width={400}
                height={400}
                className="w-full h-68 object-contain bg-white transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 w-full bg-red-600 bg-opacity-80 text-white text-center py-2 font-semibold text-lg">
                {cat.nombre}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-10">Productos Destacados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {productos.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition relative group"
            >
              <Link href={`/productos/${prod.slug}`}>
                <Image
                  src={prod.image}
                  alt={prod.title}
                  width={580}
                  height={580}
                  className="w-full h-48 object-contain bg-white transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              <button
                className="absolute top-2 right-2 z-10"
                onClick={(e) => {
                  e.preventDefault()
                  toggleFavorite(prod)
                }}
              >
                <Heart
                  className={`w-6 h-6 ${
                    favoriteIds.includes(prod.id) ? 'text-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
              <div className="p-4 flex flex-col">
                <h3 className="font-semibold text-gray-400 text-sm">{prod.title}</h3>
                <p className="text-gray-700 font-medium">${prod.price.toFixed(2)}</p>
                <button
                  className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                  onClick={(e) => {
                    e.preventDefault()
                    addToCart(prod)
                  }}
                >
                  Agregar a mi bolsa
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-red-50">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-10">Ofertas Especiales</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {ofertas.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition relative group"
            >
              <Link href={`/productos/${prod.slug}`}>
                <Image
                  src={prod.image}
                  alt={prod.title}
                  width={580}
                  height={580}
                  className="w-full h-48 object-contain bg-white transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              <button
                className="absolute top-2 right-2 z-10"
                onClick={(e) => {
                  e.preventDefault()
                  toggleFavorite(prod)
                }}
              >
                <Heart
                  className={`w-6 h-6 ${
                    favoriteIds.includes(prod.id) ? 'text-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs w-8 h-8 flex items-center justify-center rounded-full">
                -{prod.offerPrice ? Math.round(((prod.price - prod.offerPrice) / prod.price) * 100) : 0}%
              </div>
              <div className="p-4 flex flex-col">
                <h3 className="font-semibold text-gray-400 text-sm">{prod.title}</h3>
                <p className="text-gray-700 font-medium line-through">${prod.price.toFixed(2)}</p>
                <p className="text-gray-800 font-bold">${(prod.offerPrice ?? prod.price).toFixed(2)}</p>
                <button
                  className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                  onClick={(e) => {
                    e.preventDefault()
                    addToCart(prod)
                  }}
                >
                  Agregar a mi bolsa
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
