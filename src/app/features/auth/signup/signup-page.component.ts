import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

// Custom validator per password match
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const passwordConfirmation = control.get('password_confirmation');

  if (!password || !passwordConfirmation) {
    return null;
  }

  return password.value === passwordConfirmation.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    NgIf
  ],
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_confirmation: ['', [Validators.required]],
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    date_of_birth: ['1990-01-01'],
    gender: ['male'],
    street: ['Via Roma, 1'],
    city: ['Roma'],
    zip: ['00100', Validators.pattern(/^[0-9A-Za-z\s-]{3,10}$/)],
    country: ['Italia']
  }, { validators: passwordMatchValidator });

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.signupForm.value;

    this.authService.signupWithProfile(
      formValue.email!,
      formValue.password!,
      formValue.password_confirmation!,
      {
        first_name: formValue.first_name!,
        last_name: formValue.last_name!,
        date_of_birth: formValue.date_of_birth || undefined,
        gender: formValue.gender || undefined,
        street: formValue.street || undefined,
        city: formValue.city || undefined,
        zip: formValue.zip || undefined,
        country: formValue.country || undefined
      }
    ).subscribe({
      next: () => {
        this.loading = false;

        // Load cart right after signup (token just received)
        this.cartService.loadCart();
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.errors?.join(', ') || 'Signup failed. Please try again.';
      }
    });
  }

  hasError(field: string, error: string): boolean {
    const control = this.signupForm.get(field);
    return !!control && control.hasError(error) && control.touched;
  }

  hasFormError(error: string): boolean {
    return this.signupForm.hasError(error) && this.signupForm.touched;
  }
}
