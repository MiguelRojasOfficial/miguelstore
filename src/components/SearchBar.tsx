'use client'

import { Search } from 'lucide-react'

export default function SearchBar() {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Buscar productos..."
        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2
                   text-gray-700 placeholder-gray-400
                   focus:ring-2 focus:ring-red-500 focus:border-red-500
                   transition duration-200"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
    </div>
  )
}
