import { Component, inject, PLATFORM_ID } from '@angular/core';
import { NgFor, AsyncPipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../core/models/product';
import { ProductService } from '../../core/product.service';
import { ProductCardComponent } from './product-card.component';
import { Observable, map, startWith, combineLatest, BehaviorSubject, catchError, of, shareReplay } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { HttpStateCardComponent } from '../../shared/http/http-state-card/http-state-card.component';

type Sort = 'priceAsc' | 'priceDesc' | 'dateAsc' | 'dateDesc';
const cmp = (s: Sort) => (a: Product, b: Product) =>
  s === 'priceAsc' ? a.price - b.price :
    s === 'priceDesc' ? b.price - a.price :
      s === 'dateAsc' ? a.createdAt.localeCompare(b.createdAt) :
        b.createdAt.localeCompare(a.createdAt);

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.html',
  imports: [
    NgFor,
    AsyncPipe,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    ProductCardComponent,
    HttpStateCardComponent
  ]
})
export class ProductListPage {
  private service = inject(ProductService);

  // stream dei prodotti
  products$: Observable<Product[]> = this.service.list().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly httpState$ = this.products$.pipe(
    map((data) => ({ status: 'success', data } as const)),
    startWith({ status: 'loading' } as const),
    catchError((err) =>
      of({ status: 'error', message: err.message || 'Impossibile caricare i prodotti.' } as const),
    ),
  );

  // filtri come stream
  private title$ = new BehaviorSubject<string>('');
  setTitle(v: string) { this.title$.next((v ?? '').trim().toLowerCase()); }
  title: string = '';
  sort$ = new BehaviorSubject<Sort>('dateDesc');
  setSort(s: Sort) { this.sort$.next(s); }

  // lista filtrata (derived from httpState success data)
  filteredProducts$ = combineLatest([this.httpState$, this.title$, this.sort$]).pipe(
    map(([state, title, sort]) => {
      if (state.status !== 'success') return [];
      return state.data
        .filter(p => !title || p.title.toLowerCase().includes(title))
        .slice().sort(cmp(sort));
    })
  );

  onAdd(p: Product) {
    console.log('ADD', p.id);
  }

  readonly #platformId = inject(PLATFORM_ID);

  reload(): void {
    if (isPlatformBrowser(this.#platformId)) {
      window.location.reload();
    }
  }
}
