import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { environment } from '../../../environments/environment';

describe('CategoryService', () => {
    let service: CategoryService;
    let httpMock: HttpTestingController;

    const mockCategories = [
        { id: '1', name: 'Electronics' },
        { id: '2', name: 'Clothing' },
        { id: '3', name: 'Books' }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CategoryService]
        });
        service = TestBed.inject(CategoryService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('list', () => {
        it('should GET /categories and return category array', () => {
            service.list().subscribe(categories => {
                expect(categories.length).toBe(3);
                expect(categories[0].name).toBe('Electronics');
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/categories`);
            expect(req.request.method).toBe('GET');
            req.flush(mockCategories);
        });
    });
});