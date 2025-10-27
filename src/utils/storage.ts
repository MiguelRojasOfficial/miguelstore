const CART_KEY = 'miguelstore_cart'

export function loadCart() {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(CART_KEY)
  return data ? JSON.parse(data) : null
}

export function saveCart(cart: any) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}
