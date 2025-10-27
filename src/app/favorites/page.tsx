'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Heart, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

type Product = {
  id: number
  title: string
  price: number
  image: string
  description?: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([])
  const { addToCart } = useCart()

  useEffect(() => {
    const favs = localStorage.getItem('favorites')
    if (favs) setFavorites(JSON.parse(favs))
  }, [])

  const removeFavorite = (id: number) => {
    const updated = favorites.filter((p) => p.id !== id)
    setFavorites(updated)
    localStorage.setItem('favorites', JSON.stringify(updated))
  }

  if (favorites.length === 0)
    return (
      <div className="bg-gray-50 min-h-screen px-6 md:px-16 py-12">
        <h1 className="text-4xl font-bold text-red-600 mt-5 mb-12 text-center uppercase">Mis Favoritos</h1>
        <p className="text-gray-500 text-center">No tienes productos favoritos aún.</p>
      </div>
    )

  return (
    <div className="bg-gray-50 min-h-screen px-6 md:px-16 py-12">
      <h1 className="text-4xl font-bold text-red-600 mt-5 mb-12 text-center uppercase">Mis Favoritos</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {favorites.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition flex flex-col"
          >
            <div className="relative w-full h-40 sm:h-48 md:h-56">
              <Image
                src={prod.image}
                alt={prod.title}
                fill
                className="object-contain p-4"
              />
              <button
                onClick={() => removeFavorite(prod.id)}
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-100 transition"
              >
                <Heart className="w-5 h-5 text-red-500" />
              </button>
            </div>

            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-gray-400 text-sm">
                {prod.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 flex-1">
                {prod.description || 'Descripción del producto'}
              </p>
              <p className="text-gray-700 font-medium">${prod.price.toFixed(2)}</p>

              <button
                 onClick={() => {
                  addToCart(prod)
                  alert(`${prod.title} agregado a tu bolsa`)
                }}
                className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Agregar a mi bolsa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
