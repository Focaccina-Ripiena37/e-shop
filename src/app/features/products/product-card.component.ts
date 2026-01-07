import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product';

/**
 * ProductCardComponent - Displays a single product card with image, price, tags and actions
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, NgIf, NgFor, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, RouterLink],
  templateUrl: './product-card.component.html',
  styles: [`
    .product-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .image-container {
      position: relative;
      overflow: hidden;
    }

    .image-container img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .image-container img {
      transform: scale(1.05);
    }

    .sale-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #e74c3c;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 14px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .product-title {
      font-size: 16px;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .price-container {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }

    .regular-price {
      font-size: 18px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
    }

    .original-price {
      font-size: 14px;
      color: var(--mat-sys-on-surface-variant);
      text-decoration: line-through;
    }

    .sale-price {
      font-size: 18px;
      font-weight: 700;
      color: #e74c3c;
    }

    /* Tags chips */
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 8px;
    }

    .tag-chip {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 12px;
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }

    mat-card-actions {
      margin-top: auto;
      padding-top: 8px;
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() add = new EventEmitter<Product>();

  /** Calculate discount percentage */
  get discountPercentage(): number {
    if (!this.product.sale || !this.product.originalPrice) return 0;
    return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
  }
}
