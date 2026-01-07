import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TagService } from './tag.service';
import { environment } from '../../../environments/environment';

describe('TagService', () => {
    let service: TagService;
    let httpMock: HttpTestingController;

    const mockTags = [
        { id: '1', name: 'sale' },
        { id: '2', name: 'new' },
        { id: '3', name: 'popular' }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TagService]
        });
        service = TestBed.inject(TagService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('list', () => {
        it('should GET /tags and return tag array', () => {
            service.list().subscribe(tags => {
                expect(tags.length).toBe(3);
                expect(tags[0].name).toBe('sale');
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/tags`);
            expect(req.request.method).toBe('GET');
            req.flush(mockTags);
        });
    });
});