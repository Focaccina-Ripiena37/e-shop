import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProductsState } from '../../http/http-state';

@Component({
    selector: 'app-http-state-card',
    standalone: true,
    imports: [NgSwitch, NgSwitchCase, NgSwitchDefault, MatProgressSpinnerModule, MatCardModule, MatButtonModule],
    templateUrl: './http-state-card.component.html',
    styleUrls: ['./http-state-card.component.scss'],
})
export class HttpStateCardComponent {
    @Input() state: ProductsState<any> | null = null;
    @Output() retry = new EventEmitter<void>();

    onRetry(): void {
        this.retry.emit();
    }
}
