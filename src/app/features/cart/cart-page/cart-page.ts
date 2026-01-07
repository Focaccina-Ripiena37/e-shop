import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart-item';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSnackBarModule],
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.scss']
})
export class CartPage implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private errorSub?: Subscription;
  
  // Reactive cart items exposed to the template
  items$ = this.cartService.items$;
  
  ngOnInit(): void {
    // Load cart contents as soon as the page mounts
    this.cartService.loadCart();

    // Show a brief message when cart operations fail (e.g., unauthenticated)
    this.errorSub = this.cartService.error$.subscribe(message => {
      if (message) {
        this.snackBar.open(message, 'OK', { duration: 3000 });
      }
    });
  }

  ngOnDestroy(): void {
    this.errorSub?.unsubscribe();
  }
  
  updateQuantity(itemId: number, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateQuantity(itemId, quantity).subscribe();
    }
  }
  
  removeItem(itemId: number): void {
    this.cartService.removeItem(itemId).subscribe();
  }
  
  getSubtotal(item: CartItem): number {
    // Convert unit price to number and multiply by quantity
    return item.quantity * parseFloat(item.unit_price);
  }
  
  getTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + this.getSubtotal(item), 0);
  }
  
  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}