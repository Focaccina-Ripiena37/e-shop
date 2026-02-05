import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard - Protects routes that require authentication
 * Verifies the existence of a valid token and login status
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();

  // Verify that a token exists and the user is authenticated
  if (token && auth.isAuthenticated()) {
    return true;
  }

  // If not authenticated, redirect to login with returnUrl
  auth.logout(); // Clean session if token is invalid
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
