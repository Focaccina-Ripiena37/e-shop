import { Category } from './category';
import { Tag } from './tag';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  sale: boolean;
  thumbnail?: string;
  images?: string[];
  categoryId?: string;
  category?: Category;
  tags?: Tag[];
  createdAt: string;
}