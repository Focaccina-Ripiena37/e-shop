import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Error Interceptor - Gestisce errori HTTP centralizzati
 * 
 * Gestisce:
 * - 401 Unauthorized: logout automatico e redirect a login
 * - 403 Forbidden: redirect alla home
 * - 404 Not Found: log dell'errore
 * - 500+ Server Errors: log dell'errore
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Log dettagliato per debugging
            console.error(`HTTP Error ${error.status}:`, {
                url: req.url,
                method: req.method,
                message: error.message,
                error: error.error
            });

            // Gestione errori specifici
            switch (error.status) {
                case 401:
                    // Token scaduto o invalido: logout e redirect a login
                    console.warn('401 Unauthorized - Logging out user');
                    authService.logout();
                    router.navigate(['/login'], {
                        queryParams: { returnUrl: router.url }
                    });
                    break;

                case 403:
                    // Forbidden: utente non autorizzato per questa risorsa
                    console.warn('403 Forbidden - Redirecting to home');
                    router.navigate(['/products']);
                    break;

                case 404:
                    // Not Found: risorsa non esistente
                    console.warn('404 Not Found:', req.url);
                    break;

                case 0:
                    // Network error o server non raggiungibile
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
