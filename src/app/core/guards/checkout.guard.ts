import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { map, take } from 'rxjs';
import { requireAuth } from './guard-utils';

/**
 * Checkout Guard - Protects the checkout route
 * Verifies authentication and that the cart is not empty
 */
export const checkoutGuard: CanActivateFn = (_route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const cart = inject(CartService);

    // Verify authentication
    const redirect = requireAuth(router, auth, state);
    if (redirect) {
        return redirect;
    }

    // Block checkout when cart is empty
    return cart.items$.pipe(
        take(1),
        map(items => items.length > 0 ? true : router.createUrlTree(['/cart']))
    );
};