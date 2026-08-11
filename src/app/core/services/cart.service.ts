import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, map, forkJoin, catchError, filter, switchMap } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

/**
 * CartService - Server-backed cart for authenticated users, with a persisted
 * localStorage guest cart for anonymous sessions. The guest cart is synced to
 * the server automatically when the user logs in.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
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

  private readonly GUEST_CART_KEY = 'unimart_guest_cart';

  constructor() {
    // When a user logs in, push the persisted guest cart to their server cart
    this.auth.currentUser$
      .pipe(
        filter(user => !!user),
        switchMap(() => this.syncGuestCart())
      )
      .subscribe();
  }

  private get isGuest(): boolean {
    return !this.auth.getToken();
  }

  loadCart(): void {
    if (this.isGuest) {
      this.itemsSubject.next(this.readGuestCart());
      return;
    }

    this.http.get<{ cart: any, items: CartItem[], total: string }>(this.baseUrl)
      .subscribe({
        next: res => this.itemsSubject.next(res.items),
        error: (error) => {
          // Errors 401 are handled by the auth interceptor
          if (error.status !== 401) {
            this.itemsSubject.next([]);
            this.errorSubject.next('Cart is not available. Please try again.');
          }
        }
      });
  }

  addToCart(product: Product, quantity = 1): Observable<any> {
    if (this.isGuest) {
      const items = this.readGuestCart();
      const existing = items.find(i => Number(i.product.id) === Number(product.id));
      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push({
          id: Number(product.id),
          product,
          quantity,
          unit_price: String(product.price)
        });
      }
      this.writeGuestCart(items);
      this.itemsSubject.next(items);
      return of(null);
    }

    return this.http.post(`${this.baseUrl}/items`, { product_id: Number(product.id), quantity })
      .pipe(tap(() => this.loadCart()));
  }

  updateQuantity(itemId: number, quantity: number): Observable<any> {
    if (this.isGuest) {
      const items = this.readGuestCart()
        .map(item => item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item);
      this.writeGuestCart(items);
      this.itemsSubject.next(items);
      return of(null);
    }

    return this.http.patch(`${this.baseUrl}/items/${itemId}`, { quantity })
      .pipe(tap(() => this.loadCart()));
  }

  removeItem(itemId: number): Observable<any> {
    if (this.isGuest) {
      const items = this.readGuestCart().filter(item => item.id !== itemId);
      this.writeGuestCart(items);
      this.itemsSubject.next(items);
      return of(null);
    }

    return this.http.delete(`${this.baseUrl}/items/${itemId}`)
      .pipe(tap(() => this.loadCart()));
  }

  clear(): void {
    if (this.isGuest) {
      this.writeGuestCart([]);
    }
    this.itemsSubject.next([]);
  }

  // Pushes the persisted guest cart to the server after login, then clears it
  private syncGuestCart(): Observable<boolean> {
    const items = this.readGuestCart();
    if (items.length === 0) {
      return of(false);
    }

    const requests = items.map(item =>
      this.http.post(`${this.baseUrl}/items`, { product_id: Number(item.product.id), quantity: item.quantity })
    );

    return forkJoin(requests).pipe(
      tap(() => {
        this.writeGuestCart([]);
        this.loadCart();
      }),
      map(() => true),
      catchError(() => {
        this.loadCart();
        return of(true);
      })
    );
  }

  private readGuestCart(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.GUEST_CART_KEY) || '[]');
    } catch {
      return [];
    }
  }

  private writeGuestCart(items: CartItem[]): void {
    localStorage.setItem(this.GUEST_CART_KEY, JSON.stringify(items));
  }
}