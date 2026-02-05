import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Admin Guard - Protects routes reserved for administrators
 * Verifies both authentication and admin role
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Verify authentication
  if (!token || !authService.isAuthenticated()) {
    authService.logout();
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // Verify admin role
  if (authService.isAdmin) {
    return true;
  }

  // Redirect to products page if not admin
  router.navigate(['/products']);
  return false;
};