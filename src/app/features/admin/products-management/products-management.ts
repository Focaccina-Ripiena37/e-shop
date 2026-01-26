import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../core/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { TagService } from '../../../core/services/tag.service';
import { Product } from '../../../core/models/product';
import { Category } from '../../../core/models/category';
import { Tag } from '../../../core/models/tag';
import { NotificationService } from '../../../core/services/notification.service';
import { BehaviorSubject, filter, tap, map, combineLatest, Observable, switchMap, Subject, startWith, shareReplay } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type SortField = 'id' | 'title' | 'price' | 'originalPrice' | 'sale';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="products-management">
      <!-- Back navigation -->
      <button class="back-button" mat-button routerLink="/admin">
        <mat-icon>arrow_back</mat-icon>
        Back to dashboard
      </button>

      <h1>Product management</h1>

      <!-- Filter Deleted Products -->
      <div class="filter-section">
        <label for="deletedFilter">Show products:</label>
        <select id="deletedFilter" [(ngModel)]="deletedFilter" (ngModelChange)="onDeletedFilterChange()" name="deletedFilter">
          <option value="active">Active only</option>
          <option value="deleted">Deleted only</option>
          <option value="all">All products</option>
        </select>
      </div>

      <!-- Create/Update Product Form -->
      <div class="product-form">
        <h2>{{ editMode ? 'Edit product' : 'New product' }}</h2>
        <form (ngSubmit)="saveProduct()">
          <div class="form-row">
            <div class="form-group">
              <label>Title: <span class="required">*</span></label>
              <input type="text" [(ngModel)]="formProduct.title" name="title" required>
            </div>

            <div class="form-group">
              <label>Thumbnail URL: <span class="required">*</span></label>
              <input type="text" [(ngModel)]="formProduct.thumbnail" name="thumbnail" required>
            </div>
          </div>

          <div class="form-group">
            <label>Description: <span class="required">*</span></label>
            <textarea [(ngModel)]="formProduct.description" name="description" required></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Category: <span class="required">*</span></label>
              <select [(ngModel)]="formProduct.categoryId" name="categoryId" required>
                <option value="">-- Select Category --</option>
                <option *ngFor="let cat of categories$ | async" [value]="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Current Price: <span class="required">*</span></label>
              <input type="number" [(ngModel)]="formProduct.price" name="price"
                     step="0.01" min="0" required
                     (keydown)="preventComma($event)">
              <small class="price-info">Use dot (.) as decimal separator</small>
            </div>

            <div class="form-group">
              <label>Original Price: <span class="required">*</span></label>
              <input type="number" [(ngModel)]="formProduct.originalPrice" name="originalPrice"
                     step="0.01" min="0" required
                     (keydown)="preventComma($event)">
              <small class="price-hint" *ngIf="isOnSale">
                Discount: {{ discountPercentage }}% off
              </small>
            </div>

            <div class="form-group">
              <label>Created Date:</label>
              <input
                type="datetime-local"
                [(ngModel)]="formProduct.createdAt"
                name="createdAt"
              >
              <small class="date-hint">Leave empty for current date/time</small>
            </div>
          </div>

          <!-- Additional Images (Optional) -->
          <div class="form-group">
            <label>Gallery Images (optional):</label>
            <div class="images-selector">
              <div class="new-image-input">
                <input
                  type="text"
                  [(ngModel)]="newImageInput"
                  name="newImage"
                  placeholder="Paste image URL and press Enter or click +"
                  (keydown.enter)="addImage($event)"
                >
                <button type="button" class="btn-add-tag" (click)="addImage($event)">+</button>
              </div>
              <div class="images-list" *ngIf="formProduct.images?.length">
                <div class="image-item" *ngFor="let img of formProduct.images; let i = index">
                  <img [src]="img" alt="Gallery image" class="image-preview">
                  <span class="image-url">{{ img | slice:0:40 }}...</span>
                  <button type="button" class="remove-tag" (click)="removeImage(i)">&times;</button>
                </div>
              </div>
              <p class="images-hint" *ngIf="!formProduct.images?.length">No gallery images added yet.</p>
            </div>
          </div>

          <!-- Tags Multi-Select -->
          <div class="form-group">
            <label>Tags: <span class="required">*</span></label>
            <div class="tags-selector">
              <div class="tags-header">
                <div class="new-tag-input">
                  <input
                    type="text"
                    [(ngModel)]="newTagName"
                    name="newTag"
                    placeholder="Create new tag..."
                    (keydown.enter)="createTag($event)"
                  >
                  <button type="button" class="btn-add-tag" (click)="createTag($event)">+</button>
                </div>
                <button
                  type="button"
                  class="btn-delete-mode"
                  [class.active]="deleteTagMode"
                  (click)="toggleDeleteTagMode()"
                >
                  {{ deleteTagMode ? 'Cancel' : 'Remove Tags' }}
                </button>
              </div>
              <div class="tags-list">
                <span
                  *ngFor="let tag of tags$ | async"
                  class="tag-chip"
                  [class.selected]="!deleteTagMode && isTagSelected(tag.id)"
                  [class.delete-selected]="deleteTagMode && isTagMarkedForDeletion(tag.id)"
                  (click)="onTagClick(tag.id)"
                >
                  {{ tag.name }}
                </span>
              </div>
              <button
                *ngIf="deleteTagMode && tagsToDelete.length"
                type="button"
                class="btn-confirm-delete"
                (click)="confirmDeleteTags()"
              >
                Delete {{ tagsToDelete.length }} tag(s)
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">
              {{ editMode ? 'Update' : 'Create' }}
            </button>
            <button type="button" class="btn-secondary" (click)="resetForm()" *ngIf="editMode">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Product List -->
      <div class="products-list">
        <h2>Existing products</h2>
        <table>
          <thead>
            <tr>
              <th class="sortable" (click)="toggleSort('id')">
                ID
                <span class="sort-icon" *ngIf="sortField === 'id'">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="sortable" (click)="toggleSort('title')">
                Title
                <span class="sort-icon" *ngIf="sortField === 'title'">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="sortable" (click)="toggleSort('price')">
                Price
                <span class="sort-icon" *ngIf="sortField === 'price'">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="sortable" (click)="toggleSort('originalPrice')">
                Original price
                <span class="sort-icon" *ngIf="sortField === 'originalPrice'">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="sortable" (click)="toggleSort('sale')">
                Sale
                <span class="sort-icon" *ngIf="sortField === 'sale'">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th>Category</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of sortedProducts$ | async" [class.deleted-row]="isProductDeleted(product)">
              <td>{{ product.id }}</td>
              <td>
                {{ product.title }}
                <span class="deleted-badge" *ngIf="isProductDeleted(product)">🗑️ Deleted</span>
              </td>
              <td>{{ product.price | currency:'EUR' }}</td>
              <td>{{ product.originalPrice | currency:'EUR' }}</td>
              <td>
                <span class="sale-badge" *ngIf="product.sale">Yes</span>
                <span *ngIf="!product.sale">No</span>
              </td>
              <td>
                <span class="category-badge" *ngIf="product.category">{{ product.category.name }}</span>
              </td>
              <td>
                <span class="table-tag" *ngFor="let tag of product.tags">{{ tag.name }}</span>
              </td>
              <td>
                <button class="btn-edit" (click)="editProduct(product)" [disabled]="isProductDeleted(product)">Edit</button>
                <button *ngIf="!isProductDeleted(product)" class="btn-delete" (click)="deleteProduct(product.id)">Delete</button>
                <button *ngIf="isProductDeleted(product)" class="btn-restore" (click)="restoreProduct(product.id)">Restore</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .products-management {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .back-button {
      margin-bottom: 1rem;
      color: var(--mat-sys-primary);
    }

    h1 { margin-bottom: 2rem; color: var(--mat-sys-on-surface); }
    h2 { margin-bottom: 1rem; color: var(--mat-sys-on-surface); }

    .product-form {
      background: var(--mat-sys-surface);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 3rem;
      border: 1px solid var(--mat-sys-outline-variant);
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: var(--mat-sys-on-surface-variant);
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--mat-sys-outline);
      border-radius: 4px;
      font-size: 1rem;
      background: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
    }

    .form-group textarea {
      min-height: 100px;
      resize: vertical;
    }

    .required {
      color: #e74c3c;
    }

    .price-hint {
      display: block;
      margin-top: 0.25rem;
      color: #27ae60;
      font-weight: 500;
    }

    .price-info {
      display: block;
      margin-top: 0.25rem;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.85rem;
    }

    .date-hint {
      display: block;
      margin-top: 0.25rem;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.85rem;
    }

    .category-badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    /* Images Gallery */
    .images-selector {
      border: 1px solid var(--mat-sys-outline);
      border-radius: 4px;
      padding: 1rem;
      background: var(--mat-sys-surface-container);
    }

    .new-image-input {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .new-image-input input {
      flex: 1;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--mat-sys-outline);
      border-radius: 4px;
    }

    .images-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .image-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      background: var(--mat-sys-surface);
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 4px;
    }

    .image-preview {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }

    .image-url {
      flex: 1;
      font-size: 0.85rem;
      color: var(--mat-sys-on-surface-variant);
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .images-hint {
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.9rem;
      font-style: italic;
      margin: 0;
    }

    /* Tags */
    .tags-selector {
      border: 1px solid var(--mat-sys-outline);
      border-radius: 4px;
      padding: 1rem;
      background: var(--mat-sys-surface-container);
    }

    .tags-header {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .new-tag-input {
      display: flex;
      gap: 0.5rem;
      flex: 1;
      min-width: 200px;
    }

    .new-tag-input input {
      flex: 1;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--mat-sys-outline);
      border-radius: 4px;
      background: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
    }

    .btn-add-tag {
      padding: 0.5rem 1rem;
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .btn-add-tag:hover { opacity: 0.9; }

    .btn-delete-mode {
      padding: 0.5rem 1rem;
      background: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
      border: 1px solid var(--mat-sys-outline);
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }

    .btn-delete-mode:hover {
      border-color: var(--mat-sys-error);
      color: var(--mat-sys-error);
    }

    .btn-delete-mode.active {
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
      border-color: var(--mat-sys-error);
    }

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag-chip {
      padding: 0.5rem 1rem;
      background: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;
      user-select: none;
    }

    .tag-chip:hover {
      border-color: var(--mat-sys-primary);
    }

    .tag-chip.selected {
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
      border-color: var(--mat-sys-primary);
    }

    .tag-chip.delete-selected {
      background: var(--mat-sys-error);
      color: var(--mat-sys-on-error);
      border-color: var(--mat-sys-error);
    }

    .btn-confirm-delete {
      margin-top: 1rem;
      padding: 0.5rem 1.5rem;
      background: var(--mat-sys-error);
      color: var(--mat-sys-on-error);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .btn-confirm-delete:hover { opacity: 0.9; }

    .remove-tag {
      background: none;
      border: none;
      color: var(--mat-sys-on-primary-container);
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0;
      line-height: 1;
    }

    .remove-tag:hover {
      color: var(--mat-sys-error);
    }

    .form-actions {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-primary {
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
    }

    .btn-primary:hover { opacity: 0.9; }

    .btn-secondary {
      background: var(--mat-sys-outline);
      color: var(--mat-sys-on-surface);
    }

    .btn-secondary:hover { opacity: 0.9; }

    .products-list {
      background: var(--mat-sys-surface);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow-x: auto;
      border: 1px solid var(--mat-sys-outline-variant);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      color: var(--mat-sys-on-surface);
    }

    th {
      background: var(--mat-sys-surface-container);
      font-weight: bold;
      color: var(--mat-sys-on-surface);
    }

    th.sortable {
      cursor: pointer;
      user-select: none;
      transition: background 0.2s;
    }

    th.sortable:hover {
      background: var(--mat-sys-surface-container-high);
    }

    .sort-icon {
      margin-left: 0.5rem;
      font-size: 0.8rem;
    }

    .sale-badge {
      background: #27ae60;
      color: white;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .table-tag {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      margin: 0.1rem;
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
      border-radius: 12px;
      font-size: 0.8rem;
    }

    .btn-edit, .btn-delete {
      padding: 0.5rem 1rem;
      margin-right: 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .btn-edit {
      background: #f39c12;
      color: white;
    }

    .btn-edit:hover { background: #e67e22; }

    .btn-delete {
      background: #e74c3c;
      color: white;
    }

    .btn-delete:hover { background: #c0392b; }

    .btn-restore {
      padding: 0.5rem 1rem;
      margin-right: 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      background: #27ae60;
      color: white;
    }

    .btn-restore:hover { background: #229954; }

    .filter-section {
      background: var(--mat-sys-surface);
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border: 1px solid var(--mat-sys-outline-variant);
    }

    .filter-section label {
      font-weight: 600;
      color: var(--mat-sys-on-surface);
    }

    .filter-section select {
      padding: 0.5rem 1rem;
      border: 1px solid var(--mat-sys-outline);
      border-radius: 4px;
      background: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
      font-size: 0.95rem;
      cursor: pointer;
    }

    .deleted-badge {
      display: inline-block;
      margin-left: 0.5rem;
      padding: 0.25rem 0.5rem;
      background: #e74c3c;
      color: white;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .deleted-row {
      background-color: rgba(0, 0, 0, 0.05);
      opacity: 0.7;
    }

    .deleted-row td {
      color: var(--mat-sys-on-surface-variant);
      text-decoration: line-through;
    }

    .deleted-row .deleted-badge {
      text-decoration: none;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ProductsManagement implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private tagService = inject(TagService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private notify = inject(NotificationService);

  // Categories and Tags from API
  categories$: Observable<Category[]> = this.categoryService.list();
  private tagsRefresh$ = new Subject<void>();
  tags$: Observable<Tag[]> = this.tagsRefresh$.pipe(
    startWith(undefined),
    switchMap(() => this.tagService.list()),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  private tagsCache: Tag[] = [];
  newTagName = '';
  deleteTagMode = false;
  tagsToDelete: string[] = [];

  // BehaviorSubject for reactive product list management
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  // Filter for deleted products
  deletedFilter: 'all' | 'active' | 'deleted' = 'active';
  private filteredProductsSubject = new BehaviorSubject<Product[]>([]);
  filteredProducts$ = this.filteredProductsSubject.asObservable();

  // Selected tag IDs for form
  selectedTagIds: string[] = [];

  // Sorting state
  sortField: SortField = 'id';
  sortDirection: SortDirection = 'asc';
  private sortSubject = new BehaviorSubject<{ field: SortField; direction: SortDirection }>({
    field: 'id',
    direction: 'asc'
  });

  // Sorted products stream
  sortedProducts$ = combineLatest([this.filteredProducts$, this.sortSubject]).pipe(
    map(([products, sort]) => {
      return [...products].sort((a, b) => {
        let comparison = 0;
        switch (sort.field) {
          case 'id':
            comparison = Number(a.id) - Number(b.id);
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'originalPrice':
            comparison = (a.originalPrice || 0) - (b.originalPrice || 0);
            break;
          case 'sale':
            comparison = (a.sale === b.sale) ? 0 : a.sale ? -1 : 1;
            break;
        }
        return sort.direction === 'asc' ? comparison : -comparison;
      });
    })
  );

  editMode = false;
  newImageInput = '';
  // Local form state for create/update
  formProduct: Partial<Product> = this.getEmptyProduct();

  // Calculate if product is on sale (originalPrice > price)
  get isOnSale(): boolean {
    const price = this.formProduct.price || 0;
    const originalPrice = this.formProduct.originalPrice || 0;
    return originalPrice > price && price > 0;
  }

  // Calculate discount percentage
  get discountPercentage(): number {
    if (!this.isOnSale) return 0;
    const price = this.formProduct.price || 0;
    const originalPrice = this.formProduct.originalPrice || 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  ngOnInit() {
    // Reload when navigating back to this route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.loadProducts());

    this.loadProducts();

    // Cache tags for name lookup
    this.tags$.pipe(
      tap(tags => this.tagsCache = tags),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  // Prevent comma input in price fields (enforce dot decimal separator)
  preventComma(event: KeyboardEvent): void {
    if (event.key === ',') {
      event.preventDefault();
    }
  }

  // Toggle sort on column click
  toggleSort(field: SortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortSubject.next({ field: this.sortField, direction: this.sortDirection });
  }

  // Fetch products from API and update BehaviorSubject
  loadProducts() {
    this.productService.listWithDeleted().pipe(
      tap(products => {
        this.productsSubject.next(products);
        this.applyDeletedFilter();
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      error: (err) => {
        console.error('Error loading products:', err);
        this.notify.error('Failed to load products. Please refresh the page.');
      }
    });
  }

  applyDeletedFilter(): void {
    const allProducts = this.productsSubject.value;
    let filtered: Product[];

    switch (this.deletedFilter) {
      case 'active':
        filtered = allProducts.filter(p => !p.deletedAt);
        break;
      case 'deleted':
        filtered = allProducts.filter(p => !!p.deletedAt);
        break;
      case 'all':
      default:
        filtered = allProducts;
        break;
    }

    this.filteredProductsSubject.next(filtered);
  }

  onDeletedFilterChange(): void {
    this.applyDeletedFilter();
  }

  isProductDeleted(product: Product): boolean {
    return !!product.deletedAt;
  }

  restoreProduct(id: string): void {
    if (confirm('Are you sure you want to restore this product?')) {
      this.productService.restore(id).subscribe({
        next: () => {
          this.loadProducts();
          this.notify.success('Product restored successfully!');
        },
        error: (err) => {
          this.notify.error('Failed to restore product. Please try again.');
          console.error('Restore product error:', err);
        }
      });
    }
  }

  isTagSelected(tagId: string): boolean {
    return this.selectedTagIds.includes(tagId);
  }

  toggleTag(tagId: string): void {
    const index = this.selectedTagIds.indexOf(tagId);
    if (index === -1) {
      this.selectedTagIds = [...this.selectedTagIds, tagId];
    } else {
      this.selectedTagIds = this.selectedTagIds.filter(id => id !== tagId);
    }
  }

  getTagName(tagId: string): string {
    return this.tagsCache.find(t => t.id === tagId)?.name || tagId;
  }

  createTag(event: Event): void {
    event.preventDefault();
    const name = this.newTagName.trim();
    if (!name) {
      this.notify.warning('Please enter a tag name');
      return;
    }

    this.tagService.create(name).subscribe({
      next: (newTag: Tag) => {
        this.tagsRefresh$.next();
        this.selectedTagIds = [...this.selectedTagIds, newTag.id];
        this.newTagName = '';
        this.notify.success(`Tag "${name}" created successfully!`);
      },
      error: (err: any) => {
        const errorMsg = err.error?.errors?.join(', ') || err.error?.error || err.message || 'Unknown error';
        this.notify.error(`Failed to create tag: ${errorMsg}`);
        console.error('Create tag error:', err);
      }
    });
  }

  onTagClick(tagId: string): void {
    if (this.deleteTagMode) {
      this.toggleTagForDeletion(tagId);
    } else {
      this.toggleTag(tagId);
    }
  }

  toggleDeleteTagMode(): void {
    this.deleteTagMode = !this.deleteTagMode;
    this.tagsToDelete = [];
  }

  isTagMarkedForDeletion(tagId: string): boolean {
    return this.tagsToDelete.includes(tagId);
  }

  private toggleTagForDeletion(tagId: string): void {
    const index = this.tagsToDelete.indexOf(tagId);
    if (index === -1) {
      this.tagsToDelete = [...this.tagsToDelete, tagId];
    } else {
      this.tagsToDelete = this.tagsToDelete.filter(id => id !== tagId);
    }
  }

  confirmDeleteTags(): void {
    if (!this.tagsToDelete.length) return;

    const deletePromises = this.tagsToDelete.map(id =>
      this.tagService.delete(id).toPromise()
    );

    Promise.all(deletePromises)
      .then(() => {
        this.notify.success(`Deleted ${this.tagsToDelete.length} tag(s) successfully!`);
        this.selectedTagIds = this.selectedTagIds.filter(id => !this.tagsToDelete.includes(id));
        this.tagsToDelete = [];
        this.deleteTagMode = false;
        this.tagsRefresh$.next();
      })
      .catch((err) => {
        this.notify.error('Failed to delete some tags');
        console.error('Delete tags error:', err);
      });
  }

  addImage(event: Event): void {
    event.preventDefault();
    const url = this.newImageInput.trim();
    if (url && !this.formProduct.images?.includes(url)) {
      if (!this.formProduct.images) {
        this.formProduct.images = [];
      }
      this.formProduct.images = [...this.formProduct.images, url];
      this.newImageInput = '';
    }
  }

  removeImage(index: number): void {
    if (this.formProduct.images) {
      this.formProduct.images = this.formProduct.images.filter((_, i) => i !== index);
    }
  }

  saveProduct() {
    if (!this.formProduct.title?.trim() || !this.formProduct.thumbnail?.trim() ||
        !this.formProduct.description?.trim() || !this.formProduct.categoryId ||
        !this.formProduct.price || !this.formProduct.originalPrice) {
      this.notify.warning('Please fill in all required fields');
      return;
    }

    if (this.selectedTagIds.length === 0) {
      this.notify.warning('Please select at least one tag');
      return;
    }

    const price = this.formProduct.price || 0;
    const originalPrice = this.formProduct.originalPrice || 0;
    this.formProduct.sale = originalPrice > price && price > 0;

    if (!this.formProduct.createdAt) {
      this.formProduct.createdAt = new Date().toISOString();
    }

    const productData = {
      ...this.formProduct,
      tag_ids: this.selectedTagIds
    };

    if (this.editMode && this.formProduct.id) {
      this.productService.update(this.formProduct.id, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.resetForm();
          this.notify.success('Product updated successfully!');
        },
        error: (err) => {
          const errorMsg = err.error?.errors?.join(', ') || err.error?.error || err.message || 'Unknown error';
          this.notify.error(`Failed to update product: ${errorMsg}`);
          console.error('Update product error:', err);
        }
      });
    } else {
      this.productService.create(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.resetForm();
          this.notify.success('Product created successfully!');
        },
        error: (err) => {
          const errorMsg = err.error?.errors?.join(', ') || err.error?.error || err.message || 'Unknown error';
          this.notify.error(`Failed to create product: ${errorMsg}`);
          console.error('Create product error:', err);
        }
      });
    }
  }

  editProduct(product: Product) {
    this.editMode = true;
    let createdAtLocal = '';
    if (product.createdAt) {
      createdAtLocal = new Date(product.createdAt).toISOString().slice(0, 16);
    }
    this.formProduct = {
      ...product,
      images: [...(product.images || [])],
      createdAt: createdAtLocal
    };
    this.selectedTagIds = product.tags?.map(t => t.id) || [];
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.loadProducts();
          this.notify.success('Product deleted successfully!');
        },
        error: (err) => {
          this.notify.error('Failed to delete product. Please try again.');
          console.error('Delete product error:', err);
        }
      });
    }
  }

  resetForm() {
    this.editMode = false;
    this.newImageInput = '';
    this.selectedTagIds = [];
    this.formProduct = this.getEmptyProduct();
  }

  private getEmptyProduct(): Partial<Product> {
    return {
      title: '',
      description: '',
      price: 0,
      originalPrice: 0,
      sale: false,
      thumbnail: '',
      categoryId: '',
      images: [],
      createdAt: ''
    };
  }
}
