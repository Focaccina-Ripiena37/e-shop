import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { environment } from '../../../environments/environment';

describe('CartService', () => {
    let service: CartService;
    let httpMock: HttpTestingController;

    const mockCartItems = [
        { id: 1, product_id: 101, quantity: 2, unit_price: '29.99', product: { id: 101, title: 'Product 1' } },
        { id: 2, product_id: 102, quantity: 1, unit_price: '49.99', product: { id: 102, title: 'Product 2' } }
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
                expect(items[0].product_id).toBe(101);
            });
        });
    });

    describe('addToCart', () => {
        it('should POST to /cart/items', () => {
            const updatedCart = { items: [...mockCartItems, { id: 3, product_id: 103, quantity: 1 }] };

            service.addToCart(103, 1).subscribe();

            const req = httpMock.expectOne(`${environment.apiUrl}/cart/items`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({ product_id: 103, quantity: 1 });
            req.flush(updatedCart);
        });
    });

    describe('removeFromCart', () => {
        it('should DELETE /cart/items/:id', () => {
            service.removeFromCart(1).subscribe();

            const req = httpMock.expectOne(`${environment.apiUrl}/cart/items/1`);
            expect(req.request.method).toBe('DELETE');
            req.flush({ items: [mockCartItems[1]] });
        });
    });

    describe('count$', () => {
        it('should emit total quantity of items', (done) => {
            service.loadCart();

            const req = httpMock.expectOne(`${environment.apiUrl}/cart`);
            req.flush({ items: mockCartItems });

            service.count$.subscribe(count => {
                expect(count).toBe(3); // 2 + 1
                done();
            });
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