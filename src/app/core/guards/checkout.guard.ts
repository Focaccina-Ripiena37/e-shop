import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { map, take } from 'rxjs';

/**
 * Checkout Guard - Protects the checkout route
 * Verifies authentication and that the cart is not empty
 */
export const checkoutGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const cart = inject(CartService);
    const token = auth.getToken();

    // Verify authentication and valid token
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
