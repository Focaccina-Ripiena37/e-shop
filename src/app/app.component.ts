import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header.components';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);
  private cart = inject(CartService);

  ngOnInit(): void {
    if (this.auth.getToken()) {
      this.cart.loadCart();
    }
  }
}
