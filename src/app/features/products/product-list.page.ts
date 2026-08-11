import { Component, inject, PLATFORM_ID, OnInit } from '@angular/core';
import { NgFor, NgIf, AsyncPipe, TitleCasePipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { Product } from '../../core/models/product';
import { ProductService } from '../../core/product.service';
import { CartService } from '../../core/services/cart.service';
import { CategoryService } from '../../core/services/category.service';
import { TagService } from '../../core/services/tag.service';
import { Category } from '../../core/models/category';
import { Tag } from '../../core/models/tag';
import { ProductCardComponent } from './product-card.component';
import { Observable, map, startWith, combineLatest, BehaviorSubject, catchError, of, shareReplay, switchMap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { HttpStateCardComponent } from '../../shared/http/http-state-card/http-state-card.component';

type Sort = 'priceAsc' | 'priceDesc' | 'dateAsc' | 'dateDesc';
const cmp = (s: Sort) => (a: Product, b: Product) =>
  s === 'priceAsc' ? a.price - b.price :
    s === 'priceDesc' ? b.price - a.price :
      s === 'dateAsc' ? a.createdAt.localeCompare(b.createdAt) :
        b.createdAt.localeCompare(a.createdAt);

/**
 * ProductListPage - Main product catalog with filters and responsive grid
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.html',
  imports: [
    NgFor, NgIf, AsyncPipe, TitleCasePipe, FormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatSnackBarModule,
    MatSelectModule, ProductCardComponent, HttpStateCardComponent,
    MatButtonModule, MatMenuModule, MatCheckboxModule, MatDividerModule
  ],
  styles: [`
    :host {
      display: block;
      padding: 1rem;
      padding-top: 0;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Sticky filters bar - Premium elevated style */
    .filters-bar {
      position: sticky;
      top: 64px; /* Height of toolbar */
      z-index: 100;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      margin: 0 -1rem 1.5rem -1rem; /* Extend to edges */
      flex-wrap: wrap;
      background: linear-gradient(135deg, var(--mat-sys-primary-container) 0%, var(--mat-sys-surface-container-high) 100%);
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .search-field {
      flex: 1;
      min-width: 200px;
      max-width: 400px;
    }

    .filters-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .active-filters-badge {
      background: #1976d2;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .filter-section {
      padding: 0.5rem 1rem;
    }

    .filter-section-title {
      font-weight: 500;
      font-size: 14px;
      color: var(--mat-sys-on-surface-variant);
      margin-bottom: 0.5rem;
      display: block;
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    /* Product grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1rem;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .products-grid li { display: flex; }
    .products-grid app-product-card { width: 100%; }

    @media (min-width: 600px) {
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }

    @media (min-width: 960px) {
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
      }
    }

    @media (min-width: 1280px) {
      .products-grid {
        grid-template-columns: repeat(5, 1fr);
      }
    }

    .no-products {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .no-products mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
      opacity: 0.5;
    }
  `]
})
export class ProductListPage implements OnInit {
  private service = inject(ProductService);
  private cartService = inject(CartService);
  private categoryService = inject(CategoryService);
  private tagService = inject(TagService);
  private snackBar = inject(MatSnackBar);
  readonly #platformId = inject(PLATFORM_ID);

  // Categories and Tags from API
  categories$: Observable<Category[]> = this.categoryService.list().pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
    startWith([])
  );
  tags$: Observable<Tag[]> = this.tagService.list().pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
    startWith([])
  );

  // Filter streams
  private title$ = new BehaviorSubject<string>('');
  setTitle(v: string) { this.title$.next((v ?? '').trim().toLowerCase()); }

  sort$ = new BehaviorSubject<Sort>('dateDesc');
  setSort(s: Sort) { this.sort$.next(s); }

  // Category filter (single select)
  private selectedCategoryId$ = new BehaviorSubject<string>('');
  setCategory(categoryId: string) { this.selectedCategoryId$.next(categoryId); }
  get selectedCategoryId(): string { return this.selectedCategoryId$.value; }

  // Tags filter (multi select)
  private selectedTagIds$ = new BehaviorSubject<Set<string>>(new Set());

  isTagSelected(tagId: string): boolean {
    return this.selectedTagIds$.value.has(tagId);
  }

  toggleTag(tagId: string): void {
    const current = new Set(this.selectedTagIds$.value);
    if (current.has(tagId)) {
      current.delete(tagId);
    } else {
      current.add(tagId);
    }
    this.selectedTagIds$.next(current);
  }

  clearFilters(): void {
    this.selectedCategoryId$.next('');
    this.selectedTagIds$.next(new Set());
  }

  get activeFiltersCount(): number {
    return (this.selectedCategoryId$.value ? 1 : 0) + this.selectedTagIds$.value.size;
  }

  // Products stream - reloads when filters change
  private productsRefresh$ = new BehaviorSubject<void>(undefined);

  products$: Observable<Product[]> = combineLatest([
    this.productsRefresh$,
    this.selectedCategoryId$,
    this.selectedTagIds$
  ]).pipe(
    switchMap(([_, categoryId, tagIds]) => {
      const filters = {
        categoryId: categoryId || undefined,
        tagIds: tagIds.size > 0 ? Array.from(tagIds) : undefined
      };
      return this.service.list(filters);
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly httpState$ = this.products$.pipe(
    map((data) => ({ status: 'success', data } as const)),
    startWith({ status: 'loading' } as const),
    catchError((err) =>
      of({ status: 'error', message: err.message || 'Unable to load products.' } as const)
    ),
  );

  // Filtered products with local search and sort (API handles category/tag filtering)
  filteredProducts$ = combineLatest([
    this.httpState$,
    this.title$,
    this.sort$
  ]).pipe(
    map(([state, title, sort]) => {
      if (state.status !== 'success') return [];
      return state.data
        .filter(p => !title || p.title.toLowerCase().includes(title))
        .slice().sort(cmp(sort));
    })
  );

  ngOnInit(): void {
    // Initial load handled by products$ observable
  }

  onAdd(p: Product): void {
    this.cartService.addToCart(p, 1).subscribe({
      next: () => this.snackBar.open('Product added to cart!', 'OK', { duration: 3000 }),
      error: () => this.snackBar.open('Please log in to add to cart.', 'OK', { duration: 3000 })
    });
  }

  reload(): void {
    if (isPlatformBrowser(this.#platformId)) {
      window.location.reload();
    }
  }
}
