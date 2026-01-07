import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/cart`;
  
  // Local cache of cart items exposed as an observable
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  // Emits user-facing error messages for cart operations
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();
  
  // Running total of item quantities in the cart
  count$ = this.items$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );
  
  loadCart(): void {
    this.http.get<{ cart: any, items: CartItem[], total: string }>(this.baseUrl)
      .subscribe({
        next: res => this.itemsSubject.next(res.items),
        error: () => {
          this.itemsSubject.next([]);
          this.errorSubject.next('Cart is not available. Please sign in to continue.');
        }
      });
  }
  
  addToCart(productId: number, quantity = 1): Observable<any> {
    return this.http.post(`${this.baseUrl}/items`, { product_id: productId, quantity })
      .pipe(tap(() => this.loadCart()));
  }
  
  updateQuantity(itemId: number, quantity: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/items/${itemId}`, { quantity })
      .pipe(tap(() => this.loadCart()));
  }
  
  removeItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/items/${itemId}`)
      .pipe(tap(() => this.loadCart()));
  }
  
  clear(): void {
    this.itemsSubject.next([]);
  }
}