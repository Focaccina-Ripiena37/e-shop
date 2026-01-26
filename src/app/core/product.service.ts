// src/app/core/product.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './models/product';
import { environment } from '../../environments/environment';

export interface ProductFilters {
  categoryId?: string;
  tagIds?: string[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  list(filters?: ProductFilters): Observable<Product[]> {
    let params = new HttpParams();

    if (filters?.categoryId) {
      params = params.set('category_id', filters.categoryId);
    }

    if (filters?.tagIds?.length) {
      filters.tagIds.forEach(id => {
        params = params.append('tag_ids[]', id);
      });
    }

    return this.http.get<Product[]>(`${this.baseUrl}/products`, { params });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  // Admin product management methods
  create(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/admin/products`, { product });
  }

  update(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/admin/products/${id}`, { product });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/products/${id}`);
  }

  // Admin: List all products including soft-deleted
  listWithDeleted(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/admin/products`);
  }

  // Admin: Restore soft-deleted product
  restore(id: string): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/admin/products/${id}/restore`, {});
  }
}