import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order';
import { map, BehaviorSubject, combineLatest } from 'rxjs';

type SortField = 'id' | 'date' | 'status' | 'total';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-orders-list-page',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, CurrencyPipe, DatePipe, RouterModule],
  templateUrl: './orders-list-page.html',
  styleUrls: ['./orders-list-page.scss']
})
export class OrdersListPage {
  private orderService = inject(OrderService);

  private sortFieldSubject = new BehaviorSubject<SortField>('date');
  private sortDirectionSubject = new BehaviorSubject<SortDirection>('desc');

  sortField$ = this.sortFieldSubject.asObservable();
  sortDirection$ = this.sortDirectionSubject.asObservable();

  orders$ = combineLatest([
    this.orderService.getOrders(),
    this.sortField$,
    this.sortDirection$
  ]).pipe(
    map(([orders, field, direction]) => this.sortOrders(orders, field, direction))
  );

  toggleSort(field: SortField): void {
    const currentField = this.sortFieldSubject.value;
    const currentDirection = this.sortDirectionSubject.value;

    if (currentField === field) {
      this.sortDirectionSubject.next(currentDirection === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortFieldSubject.next(field);
      this.sortDirectionSubject.next('asc');
    }
  }

  getSortIcon(field: SortField, currentField: SortField, currentDirection: SortDirection): string {
    if (field !== currentField) return '';
    return currentDirection === 'asc' ? '↑' : '↓';
  }

  private sortOrders(orders: Order[], field: SortField, direction: SortDirection): Order[] {
    const sorted = [...orders].sort((a, b) => {
      let comparison = 0;

      switch (field) {
        case 'id':
          comparison = (a.id ?? 0) - (b.id ?? 0);
          break;
        case 'date':
          comparison = (a.createdAt ?? '').localeCompare(b.createdAt ?? '');
          break;
        case 'status':
          comparison = (a.status ?? '').localeCompare(b.status ?? '');
          break;
        case 'total':
          comparison = (a.total ?? 0) - (b.total ?? 0);
          break;
      }

      return direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }
}
