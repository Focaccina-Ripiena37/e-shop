import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/products" class="logo">UniMart</a>
        
        <div class="nav-links">
          <a routerLink="/products">Products</a>
          <a routerLink="/cart">Cart</a>
          
          <!-- Authenticated user links -->
          <ng-container *ngIf="authService.isLoggedIn">
            <a routerLink="/orders">My Orders</a>
            <a *ngIf="authService.isAdmin" routerLink="/admin" class="admin-link">Admin</a>
            <button (click)="authService.logout()" class="btn-logout">Logout</button>
          </ng-container>
          
          <!-- Guest links -->
          <ng-container *ngIf="!authService.isLoggedIn">
            <a routerLink="/login">Login</a>
            <a routerLink="/signup">Sign Up</a>
          </ng-container>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #2c3e50;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      transition: color 0.3s;
    }

    .nav-links a:hover {
      color: #3498db;
    }

    .admin-link {
      background: #e74c3c;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: bold;
    }

    .admin-link:hover {
      background: #c0392b !important;
      color: white !important;
    }

    .btn-logout {
      background: #95a5a6;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-logout:hover {
      background: #7f8c8d;
    }
  `]
})
export class NavbarComponent {
  // Expose auth state and actions to the template
  authService = inject(AuthService);
}