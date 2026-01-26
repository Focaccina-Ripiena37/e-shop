import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { map, take } from 'rxjs';

/**
 * Checkout Guard - Protegge la route del checkout
 * Verifica autenticazione e che il carrello non sia vuoto
 */
export const checkoutGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const cart = inject(CartService);
    const token = auth.getToken();

    // Verifica autenticazione e token valido
    if (!token || !auth.isAuthenticated()) {
        auth.logout();
        return router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url }
        });
    }

    // Block checkout when cart is empty
    return cart.items$.pipe(
        take(1),
        map(items => items.length > 0 ? true : router.createUrlTree(['/cart']))
    );
};
