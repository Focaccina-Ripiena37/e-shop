import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon color="warn">warning</mat-icon>
      Delete account
    </h2>
    <mat-dialog-content>
      <p class="warning-text">
        <strong>Are you sure you want to delete your account?</strong>
      </p>
      <p>This action will:</p>
      <ul>
        <li>Deactivate your account immediately</li>
        <li>Cancel all active orders</li>
        <li>Remove access to your order history</li>
        <li>Delete all your personal information</li>
      </ul>
      <p class="info-text">
        <mat-icon>info</mat-icon>
        Note: Completed orders will remain in our database for administrative and historical purposes, 
        but you will lose access to view them.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">
        Delete account
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--mat-sys-error);

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }

    mat-dialog-content {
      padding: 1rem 0;

      .warning-text {
        color: var(--mat-sys-error);
        margin-bottom: 1rem;
      }

      ul {
        margin: 0.5rem 0;
        padding-left: 1.5rem;
        line-height: 1.8;
      }

      .info-text {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
        padding: 1rem;
        background: var(--mat-sys-surface-container-high);
        border-radius: 8px;
        border-left: 4px solid var(--mat-sys-primary);
        font-size: 0.9rem;
        line-height: 1.6;

        mat-icon {
          flex-shrink: 0;
          margin-top: 2px;
          color: var(--mat-sys-primary);
        }
      }
    }
  `]
})
export class ConfirmDeleteDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>) {}
}
