import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { CartService } from './cart.service';
import { CartItem } from '../models/cart-item';
import { environment } from '../../../environments/environment';

describe('CartService', () => {
    let service: CartService;
    let httpMock: HttpTestingController;

    const makeProduct = (id: string, title: string, price: number) => ({
        id,
        title,
        description: '',
        price,
        originalPrice: 0,
        sale: false,
        createdAt: '2026-01-01'
    });

    const mockCartItems: CartItem[] = [
        { id: 1, product: makeProduct('101', 'Product 1', 29.99), quantity: 2, unit_price: '29.99' },
        { id: 2, product: makeProduct('102', 'Product 2', 49.99), quantity: 1, unit_price: '49.99' }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CartService]
        });
        service = TestBed.inject(CartService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('loadCart', () => {
        it('should GET /cart and update items$', () => {
            service.loadCart();

            const req = httpMock.expectOne(`${environment.apiUrl}/cart`);
            expect(req.request.method).toBe('GET');
            req.flush({ items: mockCartItems });

            service.items$.subscribe(items => {
                expect(items.length).toBe(2);
                expect(items[0].product.id).toBe('101');
                expect(items[0].quantity).toBe(2);
            });
        });
    });

    describe('addToCart', () => {
        it('should POST to /cart/items and reload the cart', () => {
            service.addToCart(103, 1).subscribe();

            const postReq = httpMock.expectOne(`${environment.apiUrl}/cart/items`);
            expect(postReq.request.method).toBe('POST');
            expect(postReq.request.body).toEqual({ product_id: 103, quantity: 1 });
            postReq.flush({ items: mockCartItems });

            const getReq = httpMock.expectOne(`${environment.apiUrl}/cart`);
            expect(getReq.request.method).toBe('GET');
            getReq.flush({ items: mockCartItems });
        });
    });

    describe('removeItem', () => {
        it('should DELETE /cart/items/:id and reload the cart', () => {
            service.removeItem(1).subscribe();

            const deleteReq = httpMock.expectOne(`${environment.apiUrl}/cart/items/1`);
            expect(deleteReq.request.method).toBe('DELETE');
            deleteReq.flush({ items: [mockCartItems[1]] });

            const getReq = httpMock.expectOne(`${environment.apiUrl}/cart`);
            getReq.flush({ items: [mockCartItems[1]] });
        });
    });

    describe('count$', () => {
        it('should emit total quantity of items', async () => {
            service.loadCart();

            const req = httpMock.expectOne(`${environment.apiUrl}/cart`);
            req.flush({ items: mockCartItems });

            const count = await firstValueFrom(service.count$);
            expect(count).toBe(3); // 2 + 1
        });
    });

    describe('clear', () => {
        it('should reset items to empty array', () => {
            service.clear();

            service.items$.subscribe(items => {
                expect(items).toEqual([]);
            });
        });
    });
});