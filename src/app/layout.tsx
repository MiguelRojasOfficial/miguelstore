'use client'

import './globals.css'
import { useState } from 'react'
import ClientSplash from "@/components/ClientSplash";
import { CartProvider } from '@/context/CartContext'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { CartSidebar } from '@/components/CartSidebar'
import Footer from '@/components/Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isCartOpen, setCartOpen] = useState(false)

  return (
    <html lang="es">
      <body className="bg-background text-foreground">
        <ClientSplash>
          <CartProvider>
            <Navbar
              onMenuClick={() => setSidebarOpen(true)}
              onCartClick={() => setCartOpen(true)}
            />
            <Sidebar open={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <CartSidebar open={isCartOpen} onClose={() => setCartOpen(false)} />
            <main className="pt-16 px-4">{children}</main>
          </CartProvider>
          <Footer />
        </ClientSplash>
      </body>
    </html>
  )
}
