Miguelstore

Miguelstore es una plataforma de e-commerce desarrollada con Next.js 13+, React 18+, TypeScript y Tailwind CSS, que permite a los usuarios navegar productos, agregarlos al carrito, gestionar favoritos y su perfil, con una experiencia de usuario moderna y completamente responsive.

Tecnologías utilizadas

Next.js 15 (App Router)

React 19

TypeScript

Tailwind CSS

React Icons

Context API para estado global (carrito, usuario, favoritos)

LocalStorage para persistencia de datos

Hooks personalizados para manejo de datos y lógica de componentes

Estructura del proyecto
/app
  ├─ account/page.tsx          # Perfil de usuario
  ├─ category/[slug]/page.tsx  # Productos por categoría
  ├─ checkout/page.tsx         # Página de checkout
  ├─ favorites/page.tsx        # Página de productos favoritos
  ├─ portfolio/page.tsx        # Página de portafolio o productos destacados
  ├─ layout.tsx                # Layout principal de la aplicación
  └─ page.tsx                  # Página de inicio

/components
  ├─ CartSidebar.tsx           # Sidebar del carrito de compras
  ├─ Footer.tsx                # Footer global
  ├─ Navbar.tsx                # Navbar principal
  ├─ SearchBar.tsx             # Barra de búsqueda de productos
  └─ UserDrop.tsx              # Menú desplegable de usuario

/context
  ├─ CartContext.tsx           # Contexto global para carrito de compras y favoritos
  └─ UserContext.tsx           # Contexto global para datos de usuario

/data
  └─ mockProducts.ts           # Datos mock de productos

/hooks
  ├─ useCart.ts                # Hook para lógica de carrito
  ├─ useFavorites.ts           # Hook para lógica de favoritos
  └─ useUser.ts                # Hook para lógica de usuario

/utils
  ├─ formatPrice.ts            # Función para formatear precios
  ├─ storage.ts                # Funciones para persistencia en localStorage
  └─ helpers.ts                # Funciones auxiliares varias

/public
  └─ images/                   # Imágenes de productos y assets públicos

Funcionalidades principales

Usuario: Registro y edición de perfil, carga de imagen, gestión de favoritos.

Productos: Visualización por categoría, búsqueda y filtrado.

Carrito de compras: Agregar, eliminar y persistir productos.

Checkout: Página de confirmación de compra.

Portafolio: Productos destacados o promociones.

Responsive: Compatible con dispositivos móviles, tablets y escritorio.

Context API: Estado global para carrito, usuario y favoritos.

Hooks personalizados: Para manejar lógica y separar responsabilidades.

Persistencia: LocalStorage para mantener datos entre sesiones.

Getting Started

Instala las dependencias:

npm install
# o
yarn
# o
pnpm install


Inicia el servidor de desarrollo:

npm run dev
# o
yarn dev
# o
pnpm dev


Abre http://localhost:3000
 para ver la aplicación.

Descripción de componentes clave

CartSidebar: Sidebar que muestra productos en el carrito, con total actualizado y botones para eliminar productos.

Footer: Pie de página global con enlaces y redes sociales.

Navbar: Barra de navegación con búsqueda, menú de usuario y enlaces a categorías.

SearchBar: Permite buscar productos por nombre o categoría.

UserDrop: Menú desplegable con opciones de perfil y logout.

Contextos

CartContext: Maneja carrito y favoritos globalmente. Funciones: agregar, eliminar, persistir en LocalStorage.

UserContext: Maneja datos de usuario, sesión y perfil.

Hooks

useCart: Lógica para agregar/remover productos del carrito.

useFavorites: Lógica para marcar/desmarcar productos favoritos.

useUser: Lógica de gestión de perfil y sesión de usuario.

Utils

formatPrice: Formatea valores numéricos a moneda local.

storage: Funciones para guardar y leer datos de LocalStorage.

helpers: Funciones auxiliares para manejo de datos y lógica común.