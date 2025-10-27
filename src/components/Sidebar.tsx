'use client'

import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [showCategories, setShowCategories] = useState(false)

  const categories = [
    { name: 'Bolsas', slug: 'bolsas' },
    { name: 'Peluches', slug: 'peluches' },
    { name: 'Hogar', slug: 'hogar' },
    { name: 'Librería', slug: 'libreria' },
    { name: 'Tecnología', slug: 'tecnologia' },
    { name: 'Juegos', slug: 'juegos' },
    { name: 'Belleza', slug: 'belleza' },
    { name: 'Decoración', slug: 'decoracion' },
    { name: 'Electrónica', slug: 'electronica' },
    { name: 'Papelería', slug: 'papeleria' },
  ]

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-transform ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-64 h-full shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" onClick={onClose} className="text-xl font-bold text-red-600">
            MiguelStore
          </Link>
          <button
            className="text-gray-600 hover:text-red-600 transition"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-6 flex-1 overflow-y-auto flex flex-col gap-4 font-medium">
          <Link href="/" onClick={onClose} className="text-gray-700 hover:text-red-600 transition">
            Inicio
          </Link>

          <button
            onClick={() => setShowCategories(!showCategories)}
            className="flex items-center justify-between text-gray-700 hover:text-red-600 transition"
          >
            <span>Categorías</span>
            {showCategories ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {showCategories && (
            <div className="ml-4 flex flex-col gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categorias/${cat.slug}`}
                  onClick={onClose}
                  className="text-gray-600 hover:text-red-500 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          <Link href="/portfolio" onClick={onClose} className="text-gray-700 hover:text-red-600 font-semibold transition">
            Portafolio
          </Link>

          <Link href="/favorites" onClick={onClose} className="text-gray-700 hover:text-red-600 transition">
            Favoritos
          </Link>
          <Link href="/account" onClick={onClose} className="text-gray-700 hover:text-red-600 transition">
            Mi Cuenta
          </Link>
        </nav>
      </div>
    </div>
  )
}
