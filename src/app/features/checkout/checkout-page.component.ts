import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { NgIf, AsyncPipe, CurrencyPipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order, BillingAddress } from '../../core/models/order';
import { CartItem } from '../../core/models/cart-item';
import { map, take, combineLatest } from 'rxjs';

@Component({
    selector: 'app-checkout-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatSelectModule,
        RouterModule,
        NgIf,
        AsyncPipe,
        CurrencyPipe,
        NgFor
    ],
    templateUrl: './checkout-page.html',
    styleUrls: ['./checkout-page.scss']
})
export class CheckoutPageComponent implements OnInit {
    private fb = inject(FormBuilder);
    private cart = inject(CartService);
    private orderService = inject(OrderService);
    private authService = inject(AuthService);

    // Reactive cart items and computed order total
    readonly items$ = this.cart.items$;
    readonly subtotal$ = this.items$.pipe(
        map(items => items.reduce((sum: number, item: CartItem) => 
            sum + item.quantity * parseFloat(item.unit_price), 0))
    );

    loading = false;
    orderSuccess = false;
    orderError = false;
    showSummary = false;
    createdOrderId?: number;

    ngOnInit(): void {
        // Ensure cart is fresh when opening checkout
        this.cart.loadCart();

        // Pre-fill form with user data
        this.authService.getUserProfile().subscribe(user => {
            if (user) {
                this.form.patchValue({
                    customer: {
                        firstName: user.first_name || '',
                        lastName: user.last_name || '',
                        email: user.email || ''
                    },
                    address: {
                        street: user.street || '',
                        city: user.city || '',
                        zip: user.zip || ''
                    }
                });
            }
        });
    }

    // Nested form grouping customer, address, billing, payment and privacy consent
    readonly form = this.fb.group({
        customer: this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]]
        }),
        address: this.fb.group({
            street: ['', [Validators.required, Validators.minLength(5)]],
            city: ['', [Validators.required, Validators.minLength(2)]],
            zip: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]]
        }),
        billing: this.fb.group({
            sameAsShipping: [false],
            fullName: ['', [Validators.required, Validators.minLength(3)]],
            street: ['', [Validators.required, Validators.minLength(5)]],
            city: ['', [Validators.required, Validators.minLength(2)]],
            zip: ['', [Validators.required, Validators.pattern(/^[0-9A-Za-z\s-]{3,10}$/)]],
            country: ['', [Validators.required, Validators.minLength(2)]],
            vatNumber: ['', Validators.pattern(/^[A-Z0-9]{8,15}$/)]
        }),
        payment: this.fb.group({
            method: ['credit_card', Validators.required],
            cardHolder: ['', [Validators.required, Validators.minLength(3)]],
            cardBrand: ['', Validators.required],
            cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
            expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]],
            cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]]
        }),
        shippingMethod: ['standard', Validators.required],
        privacy: [false, Validators.requiredTrue]
    });

    // Shipping cost based on selected method
    readonly shippingCost$ = this.form.valueChanges.pipe(
        map(() => {
            const method = this.form.get('shippingMethod')?.value;
            return method === 'premium' ? 9.99 : 3.99;
        })
    );

    // Total including shipping
    readonly total$ = combineLatest([this.subtotal$, this.shippingCost$]).pipe(
        map(([subtotal, shipping]) => subtotal + shipping)
    );

    // Watch for "same as shipping" checkbox changes
    ngAfterViewInit(): void {
        this.form.get('billing.sameAsShipping')?.valueChanges.subscribe(checked => {
            if (checked) {
                this.copyShippingToBilling();
            }
        });
    }

    copyShippingToBilling(): void {
        const customer = this.form.get('customer')?.value;
        const address = this.form.get('address')?.value;

        this.form.patchValue({
            billing: {
                fullName: `${customer?.firstName} ${customer?.lastName}`,
                street: address?.street,
                city: address?.city,
                zip: address?.zip,
                country: 'IT', // Default country
            }
        });
    }

    // Safe getter for deeply nested controls
    getControl(path: string) {
        return this.form.get(path);
    }

    // Helper to surface validation state in the template
    hasError(path: string, errorCode: string): boolean {
        const control = this.getControl(path);
        return !!control && control.hasError(errorCode) && control.touched;
    }

    // Submit handler builds the order payload and posts it
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
        this.createdOrderId = undefined;

        const value = this.form.getRawValue();

        this.items$.pipe(take(1)).subscribe(items => {
            if (!items.length) {
                this.loading = false;
                this.orderError = true;
                return;
            }

            // Extract last 4 digits of card number
            const cardNumber = value.payment?.cardNumber || '';
            const cardLast4 = cardNumber.slice(-4);

            // Get shipping type and cost
            const shippingType = value.shippingMethod || 'standard';
            const shippingCost = shippingType === 'premium' ? 9.99 : 3.99;

            const order: Order = {
                customer: value.customer as any,
                address: value.address as any,
                payment_method: value.payment?.method || 'credit_card',
                card_brand: value.payment?.cardBrand || undefined,
                card_last4: cardLast4,
                shipping_type: shippingType,
                shipping_cost: shippingCost,
                billing_address: {
                    full_name: value.billing?.fullName || '',
                    street: value.billing?.street || '',
                    city: value.billing?.city || '',
                    zip: value.billing?.zip || '',
                    country: value.billing?.country || '',
                    vat_number: value.billing?.vatNumber || undefined
                } as BillingAddress
            };

            this.orderService.create(order).subscribe({
                next: (created) => {
                    this.loading = false;
                    this.orderSuccess = true;
                    this.createdOrderId = created.id;
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

    // Move focus to the first invalid control for accessibility
    private focusFirstInvalid(): void {
        const firstInvalid = document.querySelector('form .ng-invalid[formControlName], form .ng-invalid input') as HTMLElement | null;
        firstInvalid?.focus();
    }
}