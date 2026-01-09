import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div class="admin-cards">
        <div class="admin-card">
          <h2>Product management</h2>
          <p>Create, edit, and delete products</p>
          <a routerLink="/admin/products" class="btn-primary">Go to Products</a>
        </div>

        <div class="admin-card">
          <h2>Order management</h2>
          <p>View and update order statuses</p>
          <a routerLink="/admin/orders" class="btn-primary">Go to Orders</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 2rem;
      color: var(--mat-sys-on-surface);
    }

    .admin-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .admin-card {
      background: var(--mat-sys-surface);
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .admin-card h2 {
      margin-top: 0;
      color: var(--mat-sys-on-surface);
    }

    .admin-card p {
      color: var(--mat-sys-on-surface-variant);
      margin-bottom: 1.5rem;
    }

    .btn-primary {
      display: inline-block;
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
      padding: 0.75rem 1.5rem;
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.3s, opacity 0.3s;
    }

    .btn-primary:hover {
      opacity: 0.9;
    }
  `]
})
export class AdminDashboard {}