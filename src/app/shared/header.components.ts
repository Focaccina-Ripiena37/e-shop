// src/app/shared/header.component.ts
import { Component, Input } from '@angular/core';
import { NgIf, TitleCasePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, TitleCasePipe, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-icon-button class="app-toolbar__menu" *ngIf="showIcon" aria-label="Apri menu">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="app-title">{{ title | titlecase }}</span>
    </mat-toolbar>
  `
})
export class HeaderComponent {
  @Input() title = 'Shop';
  @Input() showIcon = false;
}
