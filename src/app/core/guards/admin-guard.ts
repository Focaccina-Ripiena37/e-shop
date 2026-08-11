import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { requireAuth } from './guard-utils';

/**
 * Admin Guard - Protects routes reserved for administrators
 * Verifies both authentication and admin role
 */
export const adminGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verify authentication
  const redirect = requireAuth(router, authService, state);
  if (redirect) {
    return redirect;
  }

  // Verify admin role
  if (authService.isAdmin) {
    return true;
  }

  // Redirect to products page if not admin
  router.navigate(['/products']);
  return false;
};