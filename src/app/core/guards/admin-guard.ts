import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Admin Guard - Protegge le route riservate agli amministratori
 * Verifica sia l'autenticazione che il ruolo admin
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Verifica autenticazione
  if (!token || !authService.isAuthenticated()) {
    authService.logout();
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // Verifica ruolo admin
  if (authService.isAdmin) {
    return true;
  }

  // Redirect to products page if not admin
  router.navigate(['/products']);
  return false;
};