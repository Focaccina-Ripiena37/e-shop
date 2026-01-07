// src/app/shared/not-found.page.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <section style="padding:2rem; text-align:center">
      <h2>404 — Page not found</h2>
      <p>The requested resource does not exist.</p>
      <a routerLink="/products">Back to products</a>
    </section>
  `
})
export class NotFoundPage {}
