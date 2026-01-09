import { Component, Input, inject } from '@angular/core';
import { NgIf, TitleCasePipe, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CartService } from '../core/services/cart.service';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';

/**
 * HeaderComponent - Main navigation bar with user menu and theme toggle
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TitleCasePipe,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-icon-button class="app-toolbar__menu" *ngIf="showIcon" aria-label="Open menu">
        <mat-icon>menu</mat-icon>
      </button>
      <a routerLink="/products" class="app-title-link">
        <span class="app-title">{{ title | titlecase }}</span>
      </a>
      <span class="spacer"></span>

      <!-- Theme toggle: moon when dark mode active, sun when light mode active -->
      <button mat-icon-button
              (click)="themeService.toggle()"
              [matTooltip]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
              aria-label="Toggle theme">
        <mat-icon>{{ themeService.isDark() ? 'dark_mode' : 'light_mode' }}</mat-icon>
      </button>

      <!-- Cart -->
      <a mat-icon-button routerLink="/cart" matTooltip="Shopping cart" aria-label="Shopping cart">
        <mat-icon 
          [matBadge]="(cartCount$ | async) || 0" 
          [matBadgeHidden]="!(cartCount$ | async)" 
          matBadgeColor="accent">
          shopping_cart
        </mat-icon>
      </a>

      <!-- Authenticated user menu -->
      <ng-container *ngIf="isLoggedIn$ | async; else loggedOut">
        <button mat-icon-button [matMenuTriggerFor]="userMenu" matTooltip="Account" aria-label="User menu">
          <mat-icon>account_circle</mat-icon>
        </button>

        <mat-menu #userMenu="matMenu">
          <div class="user-email" mat-menu-item disabled>
            <mat-icon>email</mat-icon>
            <span>{{ (currentUser$ | async)?.email }}</span>
          </div>

          <mat-divider></mat-divider>

          <a mat-menu-item routerLink="/profile">
            <mat-icon>person</mat-icon>
            <span>My Profile</span>
          </a>

          <a mat-menu-item routerLink="/orders">
            <mat-icon>receipt_long</mat-icon>
            <span>My Orders</span>
          </a>

          <a *ngIf="authService.isAdmin" mat-menu-item routerLink="/admin">
            <mat-icon>admin_panel_settings</mat-icon>
            <span>Admin Dashboard</span>
          </a>

          <mat-divider></mat-divider>

          <button mat-menu-item (click)="onLogout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </ng-container>

      <ng-template #loggedOut>
        <a mat-button routerLink="/login">Login</a>
      </ng-template>
    </mat-toolbar>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .app-title-link {
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }
    .app-title-link:hover .app-title { opacity: 0.85; }
    .user-email {
      font-size: 14px;
      opacity: 0.7;
    }
  `]
})
export class HeaderComponent {
  @Input() title = 'UniMart';
  @Input() showIcon = false;

  private cartService = inject(CartService);
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);

  cartCount$ = this.cartService.count$;
  isLoggedIn$ = this.authService.isLoggedIn$;
  currentUser$ = this.authService.currentUser$;

  onLogout(): void {
    this.authService.logout();
  }
}
