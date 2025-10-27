export type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
};

export const products = [
  { id: 1, name: 'Laptop Pro', price: 1200, image: '/laptop.jpg' },
  { id: 2, name: 'Smartphone X', price: 800, image: '/phone.jpg' },
  { id: 3, name: 'Headphones Max', price: 250, image: '/headphones.jpg' },
]
