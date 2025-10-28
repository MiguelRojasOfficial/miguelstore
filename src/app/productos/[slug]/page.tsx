'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface Product {
  id: number
  title: string
  price: number
  offerPrice?: number
  image: string
  slug: string
  category: string
  stock: number
  description: string
}
type ProductPageProps = {
  params: { slug: string }
}

export default function ProductPage({ params }: any) {
  const { slug } = params as { slug: string }
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

const mockProducts: Product[] = [
  // BOLSAS
  { id: 1, title: 'Bolsa de Cuero', price: 50, offerPrice: 40, image: '/images/productos/bolsa de cuero.png', slug: 'bolsa-de-cuero', category: 'bolsas', stock: 12, description: 'Bolsa de cuero auténtico, perfecta para cualquier ocasión.' },
  { id: 2, title: 'Bolso de Tela', price: 30, image: '/images/productos/bolsa de tela.png', slug: 'bolso-de-tela', category: 'bolsas', stock: 8, description: 'Bolso de tela resistente y ligero.' },
  { id: 3, title: 'Mochila Casual', price: 45, image: '/images/productos/mochila casual.png', slug: 'mochila-casual', category: 'bolsas', stock: 10, description: 'Mochila casual, ideal para uso diario.' },
  { id: 4, title: 'Bolsa Bandolera', price: 35, image: '/images/productos/bolsa bandolera.png', slug: 'bolsa-bandolera', category: 'bolsas', stock: 7, description: 'Bolsa bandolera cómoda y moderna.' },
  { id: 5, title: 'Bolsa Shopper', price: 25, image: '/images/productos/bolsashopper.png', slug: 'bolsa-shopper', category: 'bolsas', stock: 15, description: 'Bolsa tipo shopper, ligera y resistente.' },
  { id: 6, title: 'Bolsa Tote', price: 40, image: '/images/productos/bolsa tote.png', slug: 'bolsa-tote', category: 'bolsas', stock: 9, description: 'Bolsa tote grande, ideal para el día a día.' },
  { id: 7, title: 'Mochila Escolar', price: 50, image: '/images/productos/mochila escolar.png', slug: 'mochila-escolar', category: 'bolsas', stock: 12, description: 'Mochila escolar resistente y espaciosa.' },
  { id: 8, title: 'Bolsa de Mano', price: 28, image: '/images/productos/bolsa de mano.png', slug: 'bolsa-de-mano', category: 'bolsas', stock: 10, description: 'Bolsa de mano elegante y ligera.' },

  // PELUCHES
  { id: 11, title: 'Peluche Oso', price: 20, image: '/images/productos/peluche oso.png', slug: 'peluche-oso', category: 'peluches', stock: 15, description: 'Peluche suave y adorable para todas las edades.' },
  { id: 12, title: 'Peluche Conejo', price: 17, image: '/images/productos/peluche conejo.png', slug: 'peluche-conejo', category: 'peluches', stock: 12, description: 'Peluche de conejo, perfecto para niños.' },
  { id: 13, title: 'Peluche Perro', price: 28, image: '/images/productos/peluche perro.png', slug: 'peluche-perro', category: 'peluches', stock: 10, description: 'Peluche de perro, tierno y suave.' },
  { id: 14, title: 'Peluche Oveja', price: 28, image: '/images/productos/peluche oveja.png', slug: 'peluche-oveja', category: 'peluches', stock: 9, description: 'Peluche de gato, ideal para abrazar.' },
  { id: 15, title: 'Peluche Pollo', price: 25, image: '/images/productos/peluche pollo.png', slug: 'peluche-pollo', category: 'peluches', stock: 8, description: 'Peluche de león, divertido y suave.' },
  { id: 16, title: 'Peluche Espinas', price: 30, image: '/images/productos/peluche puercoespin.png', slug: 'peluche-espinas', category: 'peluches', stock: 7, description: 'Peluche panda, adorable y acogedor.' },
  { id: 17, title: 'Peluche Elefante', price: 24, image: '/images/productos/peluche elefante.png', slug: 'peluche-elefante', category: 'peluches', stock: 11, description: 'Peluche tigre realista y suave.' },
  { id: 18, title: 'Peluche Mono', price: 28, image: '/images/productos/peluche mono.png', slug: 'peluche-mono', category: 'peluches', stock: 6, description: 'Peluche elefante grande y tierno.' },

  // HOGAR
  { id: 19, title: 'Banco', price: 35, image: '/images/productos/banco.png', slug: 'banco', category: 'hogar', stock: 20, description: 'Sábanas suaves y cómodas para tu cama.' },
  { id: 20, title: 'Almohada', price: 25, image: '/images/productos/almohada.png', slug: 'almohada-ergonomica', category: 'hogar', stock: 15, description: 'Almohada que cuida tu cuello mientras duermes.' },
  { id: 23, title: 'Cobija Polar', price: 40, image: '/images/productos/cobija polar.png', slug: 'cobija-polar', category: 'hogar', stock: 10, description: 'Cobija polar cálida y suave.' },
  { id: 24, title: 'Lámpara', price: 30, image: '/images/productos/lampara.png', slug: 'lampara', category: 'hogar', stock: 12, description: 'Toallas de algodón suaves y absorbentes.' },
  { id: 25, title: 'Mesa', price: 15, image: '/images/productos/mesa.png', slug: 'mesa', category: 'hogar', stock: 18, description: 'Vela aromática para ambientar tu hogar.' },
  { id: 26, title: 'Rodillo', price: 20, image: '/images/productos/rodillo.png', slug: 'rodillo', category: 'hogar', stock: 15, description: 'Cojín decorativo para sala o habitación.' },
  { id: 27, title: 'Ropero', price: 50, image: '/images/productos/ropero.png', slug: 'ropero', category: 'hogar', stock: 5, description: 'Alfombra moderna para decorar tu sala.' },
  { id: 28, title: 'Silla', price: 18, image: '/images/productos/silla.png', slug: 'silla', category: 'hogar', stock: 12, description: 'Portaretratos elegante para tus fotos favoritas.' },

  // TECNOLOGIA
  { id: 31, title: 'Teclado', price: 80, image: '/images/productos/teclado.png', slug: 'teclado', category: 'tecnologia', stock: 5, description: 'Teclado mecánico con switches táctiles, ideal para gamers.' },
  { id: 32, title: 'Mouse', price: 35, image: '/images/productos/mouse.png', slug: 'mouse', category: 'tecnologia', stock: 12, description: 'Mouse inalámbrico ergonómico y preciso.' },
  { id: 33, title: 'Audífonos', price: 60, image: '/images/productos/auricular.png', slug: 'audifonos-bluetooth', category: 'tecnologia', stock: 10, description: 'Audífonos bluetooth con cancelación de ruido.' },
  { id: 34, title: 'Altavoz Portátil', price: 45, image: '/images/productos/parlante.png', slug: 'altavoz-portatil', category: 'tecnologia', stock: 8, description: 'Altavoz portátil con excelente sonido.' },
  { id: 35, title: 'Cámara Web', price: 50, image: '/images/productos/camara web.png', slug: 'camara-web', category: 'tecnologia', stock: 7, description: 'Cámara web HD para videollamadas y streaming.' },
  { id: 36, title: 'Power Bank', price: 30, image: '/images/productos/power bank.png', slug: 'power-bank', category: 'tecnologia', stock: 15, description: 'Batería portátil para tus dispositivos.' },
  { id: 37, title: 'Disco Duro', price: 70, image: '/images/productos/disco duro.png', slug: 'disco-duro-externo', category: 'tecnologia', stock: 6, description: 'Disco duro externo para almacenamiento seguro.' },
  { id: 38, title: 'Tablet', price: 150, image: '/images/productos/tablet.png', slug: 'tablet', category: 'tecnologia', stock: 5, description: 'Tablet con pantalla táctil y gran rendimiento.' },

  // JUEGOS
  { id: 41, title: 'Juego de Mesa', price: 35, image: '/images/productos/juego de mesa.png', slug: 'juego-de-mesa', category: 'juegos', stock: 10, description: 'Divertido juego de mesa para toda la familia.' },
  { id: 42, title: 'Rompecabezas', price: 25, image: '/images/productos/rompecabezas.png', slug: 'rompecabezas-1000-piezas', category: 'juegos', stock: 12, description: 'Rompecabezas desafiante para mayores de 10 años.' },
  { id: 43, title: 'Cartas Coleccionables', price: 15, image: '/images/productos/cartas coleccionables.png', slug: 'cartas-coleccionables', category: 'juegos', stock: 20, description: 'Cartas coleccionables para jugar y coleccionar.' },
  { id: 44, title: 'Set de Construcción', price: 50, image: '/images/productos/juego de construccion.png', slug: 'set-de-construccion', category: 'juegos', stock: 8, description: 'Bloques de construcción para creatividad y diversión.' },
  { id: 45, title: 'Muñeco', price: 20, image: '/images/productos/muñeco de accion.png', slug: 'muneco-de-accion', category: 'juegos', stock: 15, description: 'Muñeco de acción articulado para aventuras.' },
  { id: 46, title: 'Pelota Saltarina', price: 10, image: '/images/productos/pelota saltarina.png', slug: 'pelota-saltarina', category: 'juegos', stock: 25, description: 'Pelota saltarina divertida para niños.' },
  { id: 47, title: 'Tablero de Ajedrez', price: 30, image: '/images/productos/ajedrez.png', slug: 'tablero-de-ajedrez', category: 'juegos', stock: 9, description: 'Tablero de ajedrez clásico de madera.' },
  { id: 48, title: 'Dados de Juego Clasico', price: 6, image: '/images/productos/dados de juego.png', slug: 'dados-de-juego', category: 'juegos', stock: 20, description: 'Set de dados para juegos de mesa.' },

  // LIBRERIA
  { id: 51, title: 'Cuaderno Espiral', price: 5, image: '/images/productos/cuaderno espiral.png', slug: 'cuaderno-espiral', category: 'libreria', stock: 30, description: 'Cuaderno con hojas rayadas para apuntes.' },
  { id: 52, title: 'Agenda', price: 12, image: '/images/productos/agenda.png', slug: 'agenda', category: 'libreria', stock: 20, description: 'Agenda 2025 para organizar tus actividades.' },
  { id: 53, title: 'Libro', price: 15, image: '/images/productos/libro.png', slug: 'libro', category: 'libreria', stock: 10, description: 'Libro emocionante lleno de aventuras.' },
  { id: 54, title: 'Marcadores', price: 8, image: '/images/productos/marcadores de colores.png', slug: 'marcadores-de-colores', category: 'libreria', stock: 25, description: 'Set de marcadores de colores para dibujar.' },
  { id: 55, title: 'Libro de Cocina', price: 20, image: '/images/productos/libro de cocina.png', slug: 'libro-de-cocina', category: 'libreria', stock: 12, description: 'Libro de recetas fáciles y deliciosas.' },
  { id: 56, title: 'Lápices', price: 5, image: '/images/productos/lapices de grafito.png', slug: 'lapices-de-grafito', category: 'libreria', stock: 30, description: 'Lápices de grafito de alta calidad.' },
  { id: 57, title: 'Témpera', price: 10, image: '/images/productos/tempera.png', slug: 'tempera', category: 'libreria', stock: 18, description: 'Libro ilustrado para niños.' },
  { id: 58, title: 'Bloc de Dibujo', price: 7, image: '/images/productos/bloc.png', slug: 'bloc-de-dibujo', category: 'libreria', stock: 20, description: 'Bloc de dibujo para artistas en formación.' },

  // BELLEZA
  { id: 61, title: 'Crema Facial', price: 25, image: '/images/productos/crema facial.png', slug: 'crema-facial', category: 'belleza', stock: 20, description: 'Crema facial hidratante para todo tipo de piel.' },
  { id: 62, title: 'Labial Líquido', price: 15, image: '/images/productos/labial liquido.png', slug: 'labial-liquido', category: 'belleza', stock: 30, description: 'Labial líquido de larga duración.' },
  { id: 63, title: 'Mascarilla', price: 20, image: '/images/productos/mascarilla capilar.png', slug: 'mascarilla-capilar', category: 'belleza', stock: 18, description: 'Mascarilla nutritiva para cabello seco.' },
  { id: 64, title: 'Perfume Floral', price: 40, image: '/images/productos/perfume floral.png', slug: 'perfume-floral', category: 'belleza', stock: 12, description: 'Perfume con aroma floral delicado.' },
  { id: 65, title: 'Esmalte de Uñas', price: 10, image: '/images/productos/esmalte de uñas.png', slug: 'esmalte-de-unas', category: 'belleza', stock: 25, description: 'Esmalte de uñas con acabado brillante.' },
  { id: 66, title: 'Sérum Facial', price: 30, image: '/images/productos/serum facial.png', slug: 'serum-facial', category: 'belleza', stock: 15, description: 'Sérum concentrado para rejuvenecer la piel.' },
  { id: 67, title: 'Crema de Manos', price: 12, image: '/images/productos/crema de manos.png', slug: 'crema-de-manos', category: 'belleza', stock: 22, description: 'Crema nutritiva para manos suaves.' },
  { id: 68, title: 'Desmaquillantes', price: 8, image: '/images/productos/desmaquillante.png', slug: 'toallitas-desmaquillantes', category: 'belleza', stock: 30, description: 'Toallitas prácticas para remover maquillaje.' },

  // DECORACION
  { id: 69, title: 'Cuadro Moderno', price: 50, image: '/images/productos/cuadro moderno.png', slug: 'cuadro-moderno', category: 'decoracion', stock: 10, description: 'Cuadro moderno para decorar tu sala.' },
  { id: 70, title: 'Reloj de Pared', price: 30, image: '/images/productos/reloj de pared.png', slug: 'reloj-de-pared', category: 'decoracion', stock: 15, description: 'Reloj de pared elegante y funcional.' },
  { id: 71, title: 'Jarrón de Cerámica', price: 25, image: '/images/productos/jarron.png', slug: 'jarron-de-ceramica', category: 'decoracion', stock: 12, description: 'Jarrón de cerámica para flores.' },
  { id: 72, title: 'Lámpara Colgante', price: 45, image: '/images/productos/lampara colgante.png', slug: 'lampara-colgante', category: 'decoracion', stock: 8, description: 'Lámpara colgante moderna y decorativa.' },
  { id: 73, title: 'Alfombra', price: 40, image: '/images/productos/alfombra.png', slug: 'alfombra-decorativa', category: 'decoracion', stock: 7, description: 'Alfombra para sala o habitación.' },
  { id: 74, title: 'Espejo Redondo', price: 35, image: '/images/productos/espejo.png', slug: 'espejo-redondo', category: 'decoracion', stock: 9, description: 'Espejo decorativo con marco moderno.' },
  { id: 75, title: 'Pisa Papeles', price: 15, image: '/images/productos/pisa papeles.png', slug: 'pisapapeles', category: 'decoracion', stock: 12, description: 'Portavelas elegante para ambientar tu hogar.' },
  { id: 76, title: 'Cojines', price: 20, image: '/images/productos/cojin.png', slug: 'cojines-decorativos', category: 'decoracion', stock: 14, description: 'Set de cojines para sala o habitación.' },

  // ELECTRONICA
  { id: 77, title: 'Auriculares', price: 60, image: '/images/productos/auricular.png', slug: 'auriculares-inalambricos', category: 'electronica', stock: 15, description: 'Auriculares bluetooth con cancelación de ruido.' },
  { id: 78, title: 'Smartphone', price: 250, image: '/images/productos/celular.png', slug: 'smartphone', category: 'electronica', stock: 10, description: 'Teléfono inteligente con cámara HD.' },
  { id: 79, title: 'Cargador Portátil', price: 25, image: '/images/productos/cargador portatil.png', slug: 'cargador-portatil', category: 'electronica', stock: 20, description: 'Power bank para cargar tus dispositivos.' },
  { id: 80, title: 'Teclado', price: 70, image: '/images/productos/teclado.png', slug: 'teclado-gaming', category: 'electronica', stock: 8, description: 'Teclado mecánico para gamers.' },
  { id: 81, title: 'Mouse Gaming', price: 50, image: '/images/productos/mouse.png', slug: 'mouse-gaming', category: 'electronica', stock: 12, description: 'Mouse ergonómico para juegos.' },
  { id: 82, title: 'Altavoz', price: 45, image: '/images/productos/parlante.png', slug: 'altavoz-bluetooth', category: 'electronica', stock: 10, description: 'Altavoz portátil con sonido potente.' },
  { id: 83, title: 'Cámara Digital', price: 150, image: '/images/productos/camara.png', slug: 'camara-digital', category: 'electronica', stock: 5, description: 'Cámara digital para fotografía profesional.' },
  { id: 84, title: 'Smartwatch', price: 110, image: '/images/productos/smart.png', slug: 'smartwatch-electronica', category: 'electronica', stock: 7, description: 'Reloj inteligente con notificaciones y monitoreo.' },

  // PAPELERIA
  { id: 85, title: 'Cuaderno Espiral', price: 6, image: '/images/productos/cuaderno espiral.png', slug: 'cuaderno-espiral', category: 'papeleria', stock: 25, description: 'Cuaderno para apuntes universitarios.' },
  { id: 86, title: 'Bolígrafo Azul', price: 2, image: '/images/productos/boligrafo azul.png', slug: 'boligrafo-azul', category: 'papeleria', stock: 50, description: 'Bolígrafo de tinta azul suave.' },
  { id: 87, title: 'Lápiz Grafito', price: 1, image: '/images/productos/lapices de grafito.png', slug: 'lapiz-grafito', category: 'papeleria', stock: 40, description: 'Lápiz de grafito para dibujo y escritura.' },
  { id: 88, title: 'Marcador', price: 3, image: '/images/productos/marcador permanente.png', slug: 'marcador-permanente', category: 'papeleria', stock: 30, description: 'Marcador permanente para superficies variadas.' },
  { id: 89, title: 'Resaltador', price: 4, image: '/images/productos/resaltador.png', slug: 'resaltador-fluorescente', category: 'papeleria', stock: 35, description: 'Resaltador de colores brillantes para notas.' },
  { id: 90, title: 'Goma de Borrar', price: 1, image: '/images/productos/borrador.png', slug: 'goma-de-borrar', category: 'papeleria', stock: 45, description: 'Goma de borrar suave y efectiva.' },
  { id: 91, title: 'Regla de 30cm', price: 3, image: '/images/productos/regla.png', slug: 'regla', category: 'papeleria', stock: 25, description: 'Regla de plástico de 30 cm.' },
  { id: 92, title: 'Sacapuntas', price: 2, image: '/images/productos/sacapuntas.png', slug: 'sacapuntas', category: 'papeleria', stock: 40, description: 'Sacapuntas para lápices de cualquier tamaño.' },

]

  useEffect(() => {
    const found = mockProducts.find(p => p.slug === slug)
    setProduct(found || null)
    setRelatedProducts(mockProducts.filter(p => p.slug !== slug))

    const favs = localStorage.getItem('favorites')
    if (favs) setFavoriteIds(JSON.parse(favs).map((p: Product) => p.id))
  }, [slug])

  const toggleFavorite = (p: Product) => {
    const favs = localStorage.getItem('favorites')
    let favItems: Product[] = favs ? JSON.parse(favs) : []

    if (favItems.find(item => item.id === p.id)) {
      favItems = favItems.filter(item => item.id !== p.id)
      setFavoriteIds(prev => prev.filter(id => id !== p.id))
    } else {
      favItems.push(p)
      setFavoriteIds(prev => [...prev, p.id])
    }

    localStorage.setItem('favorites', JSON.stringify(favItems))
  }

  const prev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  const next = () => {
    setCurrentIndex(prev => Math.min(prev + 1, relatedProducts.length - 3))
  }

  if (!product) return <div className="text-center py-20 text-red-600 text-xl">Producto no encontrado</div>

  return (
    <div className="bg-gray-50 min-h-screen px-6 md:px-16 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="w-full aspect-square relative">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain rounded-lg shadow-lg"
            />
          </div>
          <div className="mt-6 w-full max-w-[500px]">
            <h2 className="text-xl text-gray-600 font-semibold mb-2">Descripción</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>
        
        <div className="lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-red-600">{product.title}</h1>

          <div className="flex items-center gap-4 text-2xl">
            {product.offerPrice ? (
              <>
                <span className="text-red-600 font-bold">${product.offerPrice.toFixed(2)}</span>
                <span className="text-gray-400 line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-red-600 font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-600">Cantidad disponible: {product.stock}</p>

          <div className="flex items-center gap-4">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border border-gray-600 rounded-lg p-2 text-gray-600 text-center"
            />
            <button
              className="bg-red-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-700 transition"
              onClick={() => addToCart({ ...product, quantity })}
            >
              Agregar a mi bolsa
            </button>
          </div>

          <button
            className="flex items-center gap-2 mt-4 text-gray-700 hover:text-red-500 transition"
            onClick={() => toggleFavorite(product)}
          >
            <Heart
              className={`w-6 h-6 ${favoriteIds.includes(product.id) ? 'text-red-500' : 'text-gray-400'}`}
            />
            {favoriteIds.includes(product.id) ? 'En favoritos' : 'Agregar a favoritos'}
          </button>
        </div>
      </div>

      <section className="mt-16 relative">
        <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">También te puede interesar</h2>

        <div className="overflow-hidden relative">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 260}px)` }}
          >
            {relatedProducts.map((p) => (
              <div key={p.id} className="w-60 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition relative flex-shrink-0 mx-2 group">
                <Link href={`/productos/${p.slug}`} className="relative group">
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={240}
                    height={240}
                    className="w-full h-48 object-contain bg-white transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <button
                  className="absolute top-2 right-2 z-10"
                  onClick={(e) => { e.preventDefault(); toggleFavorite(p) }}
                >
                  <Heart
                    className={`w-6 h-6 ${favoriteIds.includes(p.id) ? 'text-red-500' : 'text-gray-400'}`}
                  />
                </button>
                <div className="p-4 flex flex-col">
                  <h3 className="font-semibold text-gray-400 text-sm">{p.title}</h3>
                  <p className="text-gray-700 font-medium">${p.offerPrice ? p.offerPrice.toFixed(2) : p.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {currentIndex > 0 && (
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 z-20 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {currentIndex < relatedProducts.length - 3 && (
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 z-20 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </section>
    </div>
  )
}