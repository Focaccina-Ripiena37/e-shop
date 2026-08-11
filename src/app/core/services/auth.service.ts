import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { User, AuthResponse, LoginRequest } from '../models/user';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private baseUrl = environment.apiUrl;
  private TOKEN_KEY = 'auth_token';
  private USER_KEY = 'current_user';

  // BehaviorSubject per stato utente reattivo
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  // Observable derivato per stato login
  isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentUserSubject.value?.admin === true;
  }


  // Login user
  login(email: string, password: string): Observable<AuthResponse> {
    const payload: LoginRequest = { user: { email, password } };
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap(response => this.setSession(response))
    );
  }

  // Signup new user with profile information
  signupWithProfile(
    email: string,
    password: string,
    passwordConfirmation: string,
    profile: {
      first_name: string;
      last_name: string;
      date_of_birth?: string;
      gender?: string;
      street?: string;
      city?: string;
      zip?: string;
      country?: string;
    }
  ): Observable<AuthResponse> {
    const payload = {
      user: {
        email,
        password,
        password_confirmation: passwordConfirmation,
        ...profile
      }
    };
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, payload).pipe(
      tap(response => this.setSession(response))
    );
  }

  // Logout user - revokes the token server-side (fire-and-forget) and clears the session
  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http
        .delete<void>(`${this.baseUrl}/logout`, { headers: { Authorization: `Bearer ${token}` } })
        .subscribe({ error: () => {} });
    }
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/products']);
  }

  // Returns the JWT token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

 
  // Checks whether the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Save token and user to localStorage + update BehaviorSubject
  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
  }


  // Loads user from localStorage
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  // Fetch current user profile with all fields
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/me`).pipe(
      tap(user => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  // Update user profile
  updateUserProfile(data: Partial<User>): Observable<User> {
    const payload = {
      user: {
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        street: data.street,
        city: data.city,
        zip: data.zip,
        country: data.country
      }
    };
    return this.http.patch<User>(`${this.baseUrl}/users/me`, payload).pipe(
      tap(user => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  // Delete user account (soft delete)
  deleteAccount(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/users/me`).pipe(
      tap(() => {
        // Clear session after account deletion
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
      })
    );
  }
}
