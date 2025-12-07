import { Injectable, inject } from '@angular/core';
import { ProductService } from '../product.service';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class CartService {
    private product$ = inject(ProductService);

    list(): Observable<Product[]> {
        return this.product$.list().pipe(
            // Prendi solo i primi 5 elementi come esempio di "carrello" mockato
            map(products => products.slice(0, 5))
        );
    }

    clear() {
        // Mock clear
        console.log('Cart cleared');
    }
}
