'use client'

import { Menu, Heart, User, ShoppingCart, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { UserDropdown } from './UserDropdown'

export function Navbar({
  onMenuClick,
  onCartClick,
}: {
  onMenuClick: () => void
  onCartClick: () => void
}) {
  const pathname = usePathname()
  const categoriesRef = useRef<HTMLUListElement>(null)

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

  useEffect(() => {
  const container = categoriesRef.current
  const activeItem = container?.querySelector('.active') as HTMLElement
  if (activeItem && container) {
    const containerRect = container.getBoundingClientRect()
    const itemRect = activeItem.getBoundingClientRect()
    const offset = itemRect.left - containerRect.left - (containerRect.width - itemRect.width) / 2
    container.scrollBy({ left: offset, behavior: 'smooth' })
  }
}, [pathname])


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-red-600 shadow-md">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <button className="md:hidden" onClick={onMenuClick}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <Link href="/" className="text-xl font-bold text-red-600">MiguelStore</Link>
        </div>

        <div className="hidden md:flex flex-1 mx-4 items-center gap-6">
          <div className="flex items-center w-full border border-gray-300 rounded-lg px-2 focus-within:ring-2 focus-within:ring-red-500">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full text-gray-700 p-2 outline-none"
            />
          </div>
          
          <Link
            href="/portfolio"
            className="font-semibold text-gray-600 hover:text-red-500 transition transform hover:scale-110"
          >
            Portafolio
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => (window.location.href = '/favorites')}>
            <Heart className="w-6 h-6 text-gray-600 hover:text-red-500 hover:scale-110 transition" />
          </button>

          <div className="text-gray-600 hover:text-red-500 transition">
            <UserDropdown />
          </div>

          <button onClick={onCartClick}>
            <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-red-500 hover:scale-110 transition" />
          </button>
        </div>
      </div>

      <div className="relative bg-gray-50 border-t border-gray-200">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

        <ul ref={categoriesRef} className="flex items-center gap-8 px-6 py-3 text-sm font-medium text-gray-700 
                 overflow-x-auto whitespace-nowrap scrollbar-hide snap-x snap-mandatory scroll-smooth md:justify-center">
          {categories.map((cat) => {
            const isActive = pathname.startsWith(`/categorias/${cat.slug}`)
            return (
              <li key={cat.slug} className="flex-shrink-0">
                <Link
                  href={`/categorias/${cat.slug}`}
                  className={`transition ${isActive ? 'text-red-600 font-semibold active' : 'hover:text-red-600'}`}
                >
                  {cat.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
