import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

/**
 * NotificationService - Provides user-friendly toast/snackbar notifications
 * Uses Angular Material's MatSnackBar for consistent UI feedback
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  /** Display a success message (green background) */
  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  /** Display an error message (red background) */
  error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  /** Display an info message (blue background) */
  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  /** Display a warning message (orange background) */
  warning(message: string, duration = 4000): void {
    this.show(message, 'warning', duration);
  }

  private show(message: string, type: NotificationType, duration: number): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: [`snackbar-${type}`],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
