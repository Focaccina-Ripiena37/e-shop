import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/orders`;

    create(orderData: Order): Observable<Order> {
        // Build API payload from client-side order model
        const payload = {
            order: {
                first_name: orderData.customer.firstName,
                last_name: orderData.customer.lastName,
                email: orderData.customer.email,
                street: orderData.address.street,
                city: orderData.address.city,
                zip: orderData.address.zip,
                payment_method: orderData.payment_method,
                card_brand: orderData.card_brand,
                card_last4: orderData.card_last4,
                shipping_type: orderData.shipping_type,
                shipping_cost: orderData.shipping_cost,
                billing_address_attributes: orderData.billing_address
            }
        };

        return this.http.post<Order>(this.baseUrl, payload).pipe(
            map(order => this.mapOrderFromApi(order))
        );
    }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.baseUrl).pipe(
            map(orders => orders.map(o => this.mapOrderFromApi(o)))
        );
    }

    getOrder(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.baseUrl}/${id}`).pipe(
            map(order => this.mapOrderFromApi(order))
        );
    }

    // Admin methods
    getAllOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${environment.apiUrl}/admin/orders`).pipe(
            map(orders => orders.map(o => this.mapOrderFromApi(o)))
        );
    }

    updateOrderStatus(orderId: number, status: string): Observable<any> {
        return this.http.put(`${environment.apiUrl}/admin/orders/${orderId}`, {
            order: { status }
        });
    }

    private mapOrderFromApi(order: any): Order {
        // Normalize API response into client-side Order shape
        return {
            id: order.id,
            customer: {
                firstName: order.first_name,
                lastName: order.last_name,
                email: order.email,
            },
            address: {
                street: order.street,
                city: order.city,
                zip: order.zip,
            },
            items: (order.order_items as any[])?.map((oi: any) => ({
                id: oi.id,
                product: oi.product,
                quantity: oi.quantity,
                unit_price: oi.unit_price
            })),
            total: order.total,
            status: order.status,
            createdAt: order.created_at,
            payment_method: order.payment_method,
            card_brand: order.card_brand,
            card_last4: order.card_last4,
            billing_address: order.billing_address,
            shipping_type: order.shipping_type,
            shipping_cost: order.shipping_cost,
            user: order.user
        };
    }
}
