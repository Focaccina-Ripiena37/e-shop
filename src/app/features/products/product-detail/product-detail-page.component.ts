import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AsyncPipe, CurrencyPipe, NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, map, combineLatest, startWith } from 'rxjs';
import { ProductService } from '../../../core/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product';

/**
 * ProductDetailPageComponent - Product detail with image gallery and suggested products
 */
@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  templateUrl: './product-detail-page.html',
  styleUrls: ['./product-detail-page.scss'],
  imports: [
    RouterModule, NgIf, NgFor, AsyncPipe, CurrencyPipe,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatSnackBarModule
  ],
})
export class ProductDetailPageComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);

  // Current selected image index for gallery
  selectedImageIndex = 0;

  // Current product stream
  readonly product$ = this.route.paramMap.pipe(
    map(params => params.get('id') as string),
    switchMap(id => this.productService.getById(id)),
  );

  // All products for suggested section
  readonly allProducts$ = this.productService.list();

  // Suggested products: same category as current product
  readonly suggestedProducts$ = combineLatest([this.product$, this.allProducts$]).pipe(
    map(([current, all]) => {
      // Prefer products in the same category
      if (current?.categoryId) {
        const sameCategory = all
          .filter(p => p.id !== current.id && p.categoryId === current.categoryId)
          .slice(0, 4);
        if (sameCategory.length >= 4) return sameCategory;
      }
      // Fallback to products with same tags
      if (!current?.tags?.length) return [];
      const currentTagIds = current.tags.map(t => t.id);
      return all
        .filter(p => p.id !== current.id)
        .filter(p => p.tags?.some(tag => currentTagIds.includes(tag.id)))
        .slice(0, 4);
    }),
    startWith([])
  );

  /** Get all images for gallery (thumbnail + images array) */
  getGalleryImages(product: Product): string[] {
    const images: string[] = [];
    if (product.thumbnail) images.push(product.thumbnail);
    if (product.images?.length) images.push(...product.images);
    // Remove duplicates
    return [...new Set(images)];
  }

  /** Select image in gallery */
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  /** Add product to cart */
  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1).subscribe({
      next: () => this.snackBar.open('Product added to cart!', 'OK', { duration: 3000 }),
      error: () => this.snackBar.open('Could not add to cart.', 'OK', { duration: 3000 })
    });
  }
}
