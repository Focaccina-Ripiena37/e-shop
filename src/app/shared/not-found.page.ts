// src/app/shared/not-found.page.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <section style="padding:2rem; text-align:center">
      <h2>404 — Pagina non trovata</h2>
      <p>La risorsa richiesta non esiste.</p>
      <a routerLink="/products">Torna ai prodotti</a>
    </section>
  `
})
export class NotFoundPage {}
