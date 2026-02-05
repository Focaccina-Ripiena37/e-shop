import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Error Interceptor - Handles centralized HTTP errors
 * 
 * Handles:
 * - 401 Unauthorized: automatic logout and redirect to login
 * - 403 Forbidden: redirect to home
 * - 404 Not Found: error logging
 * - 500+ Server Errors: error logging
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Detailed log for debugging
            console.error(`HTTP Error ${error.status}:`, {
                url: req.url,
                method: req.method,
                message: error.message,
                error: error.error
            });

            // Handle specific errors
            switch (error.status) {
                case 401:
                    // Expired or invalid token: logout and redirect to login
                    console.warn('401 Unauthorized - Logging out user');
                    authService.logout();
                    router.navigate(['/login'], {
                        queryParams: { returnUrl: router.url }
                    });
                    break;

                case 403:
                    // Forbidden: user not authorized for this resource
                    console.warn('403 Forbidden - Redirecting to home');
                    router.navigate(['/products']);
                    break;

                case 404:
                    // Not Found: resource does not exist
                    console.warn('404 Not Found:', req.url);
                    break;

                case 0:
                    // Network error or server unreachable
                    console.error('Network error: Server unreachable');
                    break;

                default:
                    if (error.status >= 500) {
                        // Server error
                        console.error('Server error:', error.status);
                    }
            }

            return throwError(() => error);
        }),
    );
};
