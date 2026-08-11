import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { requireAuth } from './guard-utils';

/**
 * Auth Guard - Protects routes that require authentication
 * Verifies the existence of a valid token and login status
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return requireAuth(router, auth, state) ?? true;
};