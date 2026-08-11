import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

class EmptyRouteComponent {}

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthService,
                provideRouter([{ path: 'products', component: EmptyRouteComponent }])
            ]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        
        // Clear localStorage before each test
        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('login', () => {
        it('should POST to /login and store token on success', () => {
            const mockResponse = {
                token: 'mock-jwt-token',
                user: { id: 1, email: 'test@example.com', admin: false }
            };

            service.login('test@example.com', 'password123').subscribe(response => {
                expect(response.token).toBe('mock-jwt-token');
                expect(response.user.email).toBe('test@example.com');
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/login`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({
                user: { email: 'test@example.com', password: 'password123' }
            });
            req.flush(mockResponse);

            expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
        });

        it('should handle login error', () => {
            service.login('wrong@example.com', 'wrongpass').subscribe({
                error: (error) => {
                    expect(error.status).toBe(401);
                }
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/login`);
            req.flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
        });
    });

    describe('signupWithProfile', () => {
        it('should POST to /signup with profile data', () => {
            const mockResponse = {
                token: 'new-user-token',
                user: { id: 2, email: 'new@example.com', admin: false }
            };

            service.signupWithProfile('new@example.com', 'password123', 'password123', {
                first_name: 'Jane',
                last_name: 'Doe'
            }).subscribe(response => {
                expect(response.token).toBe('new-user-token');
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/signup`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body.user.email).toBe('new@example.com');
            expect(req.request.body.user.first_name).toBe('Jane');
            req.flush(mockResponse);
        });
    });

    describe('logout', () => {
        it('should revoke the token server-side and clear localStorage', () => {
            localStorage.setItem('auth_token', 'some-token');
            localStorage.setItem('current_user', JSON.stringify({ id: 1 }));

            service.logout();

            const req = httpMock.expectOne(`${environment.apiUrl}/logout`);
            expect(req.request.method).toBe('DELETE');
            expect(req.request.headers.get('Authorization')).toBe('Bearer some-token');
            req.flush(null, { status: 204, statusText: 'No Content' });

            expect(localStorage.getItem('auth_token')).toBeNull();
            expect(localStorage.getItem('current_user')).toBeNull();
        });

        it('should clear localStorage without API call when no token exists', () => {
            service.logout();

            httpMock.expectNone(`${environment.apiUrl}/logout`);

            expect(localStorage.getItem('auth_token')).toBeNull();
            expect(localStorage.getItem('current_user')).toBeNull();
        });
    });

    describe('isAuthenticated', () => {
        it('should return true when a non-expired token exists', () => {
            const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
            const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }));
            localStorage.setItem('auth_token', `${header}.${payload}.signature`);
            expect(service.isAuthenticated()).toBe(true);
        });

        it('should return false when no token', () => {
            expect(service.isAuthenticated()).toBe(false);
        });

        it('should return false for an expired token', () => {
            const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
            const expiredPayload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 3600 }));
            localStorage.setItem('auth_token', `${header}.${expiredPayload}.signature`);
            expect(service.isAuthenticated()).toBe(false);
        });

        it('should return false for a malformed token', () => {
            localStorage.setItem('auth_token', 'not-a-jwt');
            expect(service.isAuthenticated()).toBe(false);
        });
    });

    describe('isAdmin', () => {
        it('should return true for admin user after login', () => {
            service.login('admin@test.com', 'password123').subscribe();

            const req = httpMock.expectOne(`${environment.apiUrl}/login`);
            req.flush({ token: 't', user: { id: 1, email: 'admin@test.com', admin: true } });

            expect(service.isAdmin).toBe(true);
        });

        it('should return false for non-admin user after login', () => {
            service.login('user@test.com', 'password123').subscribe();

            const req = httpMock.expectOne(`${environment.apiUrl}/login`);
            req.flush({ token: 't', user: { id: 2, email: 'user@test.com', admin: false } });

            expect(service.isAdmin).toBe(false);
        });
    });
});