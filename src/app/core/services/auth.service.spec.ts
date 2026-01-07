import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [AuthService]
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

    describe('signup', () => {
        it('should POST to /signup with user data', () => {
            const mockResponse = {
                token: 'new-user-token',
                user: { id: 2, email: 'new@example.com', admin: false }
            };

            service.signup('new@example.com', 'password123', 'password123').subscribe(response => {
                expect(response.token).toBe('new-user-token');
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/signup`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body.user.email).toBe('new@example.com');
            req.flush(mockResponse);
        });
    });

    describe('logout', () => {
        it('should clear token and user from localStorage', () => {
            localStorage.setItem('auth_token', 'some-token');
            localStorage.setItem('current_user', JSON.stringify({ id: 1 }));

            service.logout();

            expect(localStorage.getItem('auth_token')).toBeNull();
            expect(localStorage.getItem('current_user')).toBeNull();
        });
    });

    describe('isAuthenticated', () => {
        it('should return true when token exists', () => {
            localStorage.setItem('auth_token', 'valid-token');
            expect(service.isAuthenticated()).toBe(true);
        });

        it('should return false when no token', () => {
            expect(service.isAuthenticated()).toBe(false);
        });
    });

    describe('isAdmin', () => {
        it('should return true for admin user', () => {
            const adminUser = { id: 1, email: 'admin@test.com', admin: true };
            localStorage.setItem('current_user', JSON.stringify(adminUser));
            
            // Re-initialize service to pick up stored user
            service = TestBed.inject(AuthService);
            
            expect(service.isAdmin).toBe(true);
        });

        it('should return false for non-admin user', () => {
            const regularUser = { id: 2, email: 'user@test.com', admin: false };
            localStorage.setItem('current_user', JSON.stringify(regularUser));
            
            service = TestBed.inject(AuthService);
            
            expect(service.isAdmin).toBe(false);
        });
    });
});