import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from '../product.service';
import { Product } from '../models/product';

describe('ProductService', () => {
    let service: ProductService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ProductService]
        });
        service = TestBed.inject(ProductService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should GET /products and return products', () => {
        const mockProducts: Product[] = [
            { id: 'p1', title: 'Product 1', price: 10, description: 'desc', originalPrice: 10, sale: false, createdAt: '2023-01-01' },
            { id: 'p2', title: 'Product 2', price: 20, description: 'desc', originalPrice: 20, sale: false, createdAt: '2023-01-02' }
        ];

        service.list().subscribe(products => {
            expect(products.length).toBe(2);
            expect(products).toEqual(mockProducts);
        });

        const req = httpMock.expectOne('http://localhost:3001/api/products');
        expect(req.request.method).toBe('GET');
        req.flush(mockProducts);
    });
});
