import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { Order } from '../models/order';
import { environment } from '../../../environments/environment';

describe('OrderService', () => {
    let service: OrderService;
    let httpMock: HttpTestingController;

    const mockApiOrder = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        street: '123 Main St',
        city: 'New York',
        zip: '10001',
        total: '99.99',
        status: 'pending',
        created_at: '2025-01-15T10:00:00Z',
        order_items: [
            { id: 1, product: { id: 101, title: 'Product 1' }, quantity: 2, unit_price: '29.99' }
        ]
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [OrderService]
        });
        service = TestBed.inject(OrderService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('create', () => {
        it('should POST order and map response correctly', () => {
            const orderData: Order = {
                customer: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
                address: { street: '123 Main St', city: 'New York', zip: '10001' },
                payment_method: 'credit_card',
                card_brand: 'visa',
                card_last4: '4242'
            };

            service.create(orderData).subscribe(order => {
                expect(order.id).toBe(1);
                expect(order.customer.firstName).toBe('John');
                expect(order.address.city).toBe('New York');
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/orders`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body.order.first_name).toBe('John');
            req.flush(mockApiOrder);
        });
    });

    describe('getOrders', () => {
        it('should GET user orders and map to client format', () => {
            service.getOrders().subscribe(orders => {
                expect(orders.length).toBe(1);
                expect(orders[0].customer.firstName).toBe('John');
                expect(orders[0].items?.length).toBe(1);
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/orders`);
            expect(req.request.method).toBe('GET');
            req.flush([mockApiOrder]);
        });
    });

    describe('getOrder', () => {
        it('should GET single order by id', () => {
            service.getOrder(1).subscribe(order => {
                expect(order.id).toBe(1);
                expect(order.status).toBe('pending');
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/orders/1`);
            expect(req.request.method).toBe('GET');
            req.flush(mockApiOrder);
        });
    });

    describe('getAllOrders (admin)', () => {
        it('should GET all orders from admin endpoint', () => {
            service.getAllOrders().subscribe(orders => {
                expect(orders.length).toBe(2);
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/admin/orders`);
            expect(req.request.method).toBe('GET');
            req.flush([mockApiOrder, { ...mockApiOrder, id: 2 }]);
        });
    });

    describe('updateOrderStatus (admin)', () => {
        it('should PUT order status update', () => {
            service.updateOrderStatus(1, 'shipped').subscribe();

            const req = httpMock.expectOne(`${environment.apiUrl}/admin/orders/1`);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual({ order: { status: 'shipped' } });
            req.flush({ ...mockApiOrder, status: 'shipped' });
        });
    });
});