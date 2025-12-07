import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/api';

    create(order: Order): Observable<any> {
        return this.http.post(`${this.baseUrl}/orders`, order);
    }
}
