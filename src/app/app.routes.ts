// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { checkoutGuard } from './core/guards/checkout.guard';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list.page').then(m => m.ProductListPage)
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail-page.component').then(
        m => m.ProductDetailPageComponent
      )
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart-page/cart-page').then(m => m.CartPage)
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout-page.component').then(m => m.CheckoutPageComponent),
    canActivate: [checkoutGuard]
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/orders-list-page').then(m => m.OrdersListPage),
    canActivate: [authGuard]
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./features/orders/order-detail-page').then(m => m.OrderDetailPage),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile-page.component').then(m => m.ProfilePageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup-page.component').then(m => m.SignupPageComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/products-management/products-management').then(m => m.ProductsManagement)
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/orders-management/orders-management').then(m => m.OrdersManagement)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/not-found.page').then(m => m.NotFoundPage)
  }
];
