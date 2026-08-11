import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CartService } from './cart.service';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';
import { environment } from '../../../environments/environment';

describe('CartService', () => {
    let service: CartService;
    let httpMock: HttpTestingController;

    const makeProduct = (id: string, title: string, price: number): Product => ({
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
            providers: [CartService, provideRouter([])]
        });
        service = TestBed.inject(CartService);
        httpMock = TestBed.inject(HttpTestingController);
        localStorage.clear();
        // Authenticated by default so existing tests exercise the server path
        localStorage.setItem('auth_token', 'test-jwt');
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
            service.addToCart(makeProduct('103', 'New', 10), 1).subscribe();

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

    describe('guest cart (persisted in localStorage)', () => {
        beforeEach(() => {
            localStorage.removeItem('auth_token');
        });

        it('should restore persisted items without any HTTP call', () => {
            localStorage.setItem('unimart_guest_cart', JSON.stringify(mockCartItems));

            service.loadCart();

            service.items$.subscribe(items => {
                expect(items.length).toBe(2);
                expect(items[0].product.title).toBe('Product 1');
            });
        });

        it('addToCart should store locally without any HTTP call', () => {
            service.addToCart(makeProduct('103', 'New', 5.5), 1).subscribe();

            service.items$.subscribe(items => {
                expect(items.length).toBe(1);
                expect(items[0].product.title).toBe('New');
                expect(items[0].unit_price).toBe('5.5');
            });
            expect(JSON.parse(localStorage.getItem('unimart_guest_cart')!)).toHaveLength(1);
        });

        it('addToCart should merge quantities for the same product', () => {
            const product = makeProduct('103', 'New', 5.5);
            service.addToCart(product, 2).subscribe();
            service.addToCart(product, 3).subscribe();

            service.items$.subscribe(items => {
                expect(items.length).toBe(1);
                expect(items[0].quantity).toBe(5);
            });
        });

        it('updateQuantity should clamp quantity to a minimum of 1', () => {
            service.addToCart(makeProduct('103', 'New', 5.5), 2).subscribe();
            service.updateQuantity(103, 0).subscribe();

            service.items$.subscribe(items => {
                expect(items[0].quantity).toBe(1);
            });
        });

        it('removeItem should delete the local item', () => {
            service.addToCart(makeProduct('103', 'New', 5.5), 1).subscribe();
            service.removeItem(103).subscribe();

            service.items$.subscribe(items => {
                expect(items.length).toBe(0);
            });
        });

        it('clear should empty the persisted guest cart', () => {
            service.addToCart(makeProduct('103', 'New', 5.5), 1).subscribe();
            service.clear();

            expect(JSON.parse(localStorage.getItem('unimart_guest_cart')!)).toEqual([]);
        });
    });
});