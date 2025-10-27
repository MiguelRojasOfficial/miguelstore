'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type Product = {
  id: number
  title: string
  price: number
  image: string
  quantity?: number
}

type CartContextType = {
  cart: Product[]
  addToCart: (product: Product) => void
  removeFromCart: (product: Product) => void
  updateQuantity: (product: Product, quantity: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) setCart(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id)
      if (exists) {
        return prev.map((p) =>
          p.id === product.id  ? { ...p, quantity: (p.quantity || 0) + (product.quantity || 1) } : p
        )
      } else {
        return [...prev, { ...product, quantity: product.quantity || 1 }]
      }
    })
  }

  const removeFromCart = (product: Product) => {
    setCart((prev) => prev.filter((p) => p.id !== product.id))
  }

  const updateQuantity = (product: Product, quantity: number) => {
    if (quantity < 1) return
    setCart((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, quantity } : p))
    )
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}