import { Product } from './product';

export interface OrderItem {
    id?: number;
    product: Product;
    quantity: number;
    unit_price: number;
}

export interface BillingAddress {
    id?: number;
    full_name: string;
    street: string;
    city: string;
    zip: string;
    country: string;
    vat_number?: string;
}

export interface Order {
    id?: number;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
    };
    address: {
        street: string;
        city: string;
        zip: string;
    };
    items?: OrderItem[];
    total?: number;
    status?: string;
    createdAt?: string;
    payment_method?: string;
    card_brand?: string;
    card_last4?: string;
    billing_address?: BillingAddress;
    shipping_type?: string;
    shipping_cost?: number;
    // Raw API snake_case fields (optional) to ease mapping without strict transforms
    first_name?: string;
    last_name?: string;
    street?: string;
    city?: string;
    zip?: string;
    order_items?: OrderItem[];
    created_at?: string;
    user?: { id: number; email: string; active?: boolean };
}
