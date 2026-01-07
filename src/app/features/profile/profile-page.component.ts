import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      email: [{ value: '', disabled: true }],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: [''],
      gender: [''],
      street: [''],
      city: [''],
      zip: ['', Validators.pattern(/^[0-9A-Za-z\s-]{3,10}$/)],
      country: ['']
    });

    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.authService.getUserProfile().subscribe({
      next: (user: User) => {
        this.profileForm.patchValue({
          email: user.email,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          dateOfBirth: user.date_of_birth || '',
          gender: user.gender || '',
          street: user.street || '',
          city: user.city || '',
          zip: user.zip || '',
          country: user.country || ''
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.loading = false;
        this.snackBar.open('Error loading profile', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.profileForm.getRawValue();
    const updateData = {
      first_name: formValue.firstName,
      last_name: formValue.lastName,
      date_of_birth: formValue.dateOfBirth,
      gender: formValue.gender,
      street: formValue.street,
      city: formValue.city,
      zip: formValue.zip,
      country: formValue.country
    };

    this.authService.updateUserProfile(updateData).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.loading = false;
        this.snackBar.open('Error updating profile', 'Close', { duration: 3000 });
      }
    });
  }

  hasError(field: string, errorType: string): boolean {
    const control = this.profileForm.get(field);
    return !!(control && control.hasError(errorType) && (control.dirty || control.touched));
  }

  onDeleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.loading = true;
        this.authService.deleteAccount().subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('Account successfully deleted', 'Close', { duration: 3000 });
            this.router.navigate(['/products']);
          },
          error: (err) => {
            console.error('Error deleting account:', err);
            this.loading = false;
            this.snackBar.open('Error deleting account', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}
