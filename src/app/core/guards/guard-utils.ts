import { Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Shared auth check for guards - returns a redirect UrlTree when the user is
 * not authenticated (after cleaning up the stale session), or null to allow
 * the navigation to proceed.
 */
export function requireAuth(
  router: Router,
  auth: AuthService,
  state: RouterStateSnapshot
): UrlTree | null {
  if (auth.isAuthenticated()) {
    return null;
  }

  // Clean up the session when the token is missing or invalid
  auth.logout();
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
}