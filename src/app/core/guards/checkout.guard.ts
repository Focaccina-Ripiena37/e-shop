import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { map, take } from 'rxjs';

export const checkoutGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const cart = inject(CartService);

    if (!auth.isAuthenticated()) {
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
