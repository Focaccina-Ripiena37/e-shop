import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header.components';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  private cart = inject(CartService);

  ngOnInit(): void {
    // Load the cart for both guests (localStorage) and authenticated users (server)
    this.cart.loadCart();
  }
}
