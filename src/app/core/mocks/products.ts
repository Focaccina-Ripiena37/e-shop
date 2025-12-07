import { Product } from '../models/product';

export const PRODUCTS_MOCK: Product[] = [
  {
    id: 'p-001',
    title: 'Laptop Ultra 14"',
    description: 'Laptop Ultra 14" pensato per produttività e utilizzo quotidiano.',
    price: 40,
    originalPrice: 40,
    sale: false,
    thumbnail: 'https://dummyimage.com/600x400/000000/fff.jpg&text=Laptop+Ultra+14',
    tags: ['laptop', 'notebook', 'portatile'],
    createdAt: '2025-01-10T10:00:00.000Z'
  },
  {
    id: 'p-002',
    title: 'Laptop Pro 16"',
    description: 'Laptop Pro 16" pensato per produttività e utilizzo quotidiano.',
    price: 75,
    originalPrice: 85,
    sale: true,
    thumbnail: 'https://dummyimage.com/600x400/000000/fff.jpg&text=Laptop+Pro+16',
    tags: ['laptop', 'notebook', 'portatile'],
    createdAt: '2025-01-11T10:00:00.000Z'
  }
];