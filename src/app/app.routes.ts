// src/app/app.routes.ts
import { Routes } from '@angular/router';

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
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout-page.component').then(m => m.CheckoutPageComponent)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/not-found.page').then(m => m.NotFoundPage)
  }
];
