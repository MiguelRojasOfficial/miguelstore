'use client'

import { X, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function CartSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const router = useRouter()

  const subtotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
  const discount = 0
  const total = subtotal - discount

  const handleCheckout = () => {
    onClose()
    router.push('/checkout')
  }

  return (
    <div className={`fixed inset-0 z-50 transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="relative bg-white w-96 h-full shadow-lg flex flex-col ml-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-red-600">Mi bolsa</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600 hover:text-red-600 transition" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-500">Tu carrito está vacío</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex gap-4 border-b pb-4">
                <div className="w-20 h-20 relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain rounded bg-gray-100"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="text-gray-600 font-semibold">{item.title}</h3>
                    <button onClick={() => removeFromCart(item)} className="text-red-500 hover:text-red-700 transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item, (item.quantity || 1) - 1)}
                      className="w-6 h-6 border rounded hover:bg-gray-200 text-gray-400 transition"
                    >
                      -
                    </button>
                    <span className="text-gray-400">{item.quantity || 1}</span>
                    <button
                      onClick={() => updateQuantity(item, (item.quantity || 1) + 1)}
                      className="w-6 h-6 border rounded hover:bg-gray-200 text-gray-400 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="text-gray-600 p-4 border-t flex flex-col gap-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Descuento:</span>
              <span>${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Comprar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
