import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, AsyncPipe, CurrencyPipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order';
import { map, take } from 'rxjs';
import { Product } from '../../core/models/product';

@Component({
    selector: 'app-checkout-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        RouterModule,
        NgIf,
        AsyncPipe,
        CurrencyPipe,
        NgFor
    ],
    templateUrl: './checkout-page.html',
    styleUrls: ['./checkout-page.scss']
})
export class CheckoutPageComponent {
    private fb = inject(FormBuilder);
    private cart = inject(CartService);
    private orderService = inject(OrderService);

    readonly items$ = this.cart.list();
    readonly total$ = this.items$.pipe(
        map(items => items.reduce((sum: number, item: Product & { quantity?: number }) => sum + item.price * (item.quantity ?? 1), 0))
    );

    loading = false;
    orderSuccess = false;
    orderError = false;
    showSummary = false;

    readonly form = this.fb.group({
        customer: this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]]
        }),
        address: this.fb.group({
            street: ['', Validators.required],
            city: ['', Validators.required],
            zip: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]]
        }),
        shippingMethod: ['standard', Validators.required],
        privacy: [false, Validators.requiredTrue]
    });

    getControl(path: string) {
        return this.form.get(path);
    }

    hasError(path: string, errorCode: string): boolean {
        const control = this.getControl(path);
        return !!control && control.hasError(errorCode) && control.touched;
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.showSummary = true;
            this.focusFirstInvalid();
            return;
        }

        this.showSummary = false;
        this.loading = true;
        this.orderSuccess = false;
        this.orderError = false;

        const value = this.form.getRawValue();

        this.items$.pipe(take(1)).subscribe(items => {
            const order: Order = {
                customer: value.customer as any,
                address: value.address as any,
                items,
                total: items.reduce((sum: number, it: Product & { quantity?: number }) => sum + it.price * (it.quantity ?? 1), 0),
                createdAt: new Date().toISOString()
            };

            this.orderService.create(order).subscribe({
                next: () => {
                    this.loading = false;
                    this.orderSuccess = true;
                    this.cart.clear();
                    this.form.reset();
                },
                error: () => {
                    this.loading = false;
                    this.orderError = true;
                }
            });
        });
    }

    private focusFirstInvalid(): void {
        const firstInvalid = document.querySelector('form .ng-invalid[formControlName], form .ng-invalid input') as HTMLElement | null;
        firstInvalid?.focus();
    }
}
