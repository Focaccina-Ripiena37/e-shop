import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard - Protegge le route che richiedono autenticazione
 * Verifica l'esistenza di un token valido e lo stato di login
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();

  // Verifica che esista un token e che l'utente sia autenticato
  if (token && auth.isAuthenticated()) {
    return true;
  }

  // Se non autenticato, redirect a login con returnUrl
  auth.logout(); // Pulisci sessione se token invalido
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
