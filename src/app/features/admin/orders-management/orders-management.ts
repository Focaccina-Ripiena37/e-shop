import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order';
import { NotificationService } from '../../../core/services/notification.service';
import { BehaviorSubject, filter, tap, combineLatest, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type SortField = 'id' | 'customer' | 'date' | 'status' | 'total';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="orders-management">
      <!-- Back navigation -->
      <a routerLink="/admin" class="back-link">
        <span class="back-arrow">&#8592;</span> Back to dashboard
      </a>

      <h1>Order management</h1>

      <div class="filters">
        <label>
          User status:
          <select [(ngModel)]="userStatusFilter" (change)="applyFilters()">
            <option value="all">All users</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>
        </label>
      </div>

      <div class="orders-list">
        <table>
          <thead>
            <tr>
              <th 
                class="sortable" 
                (click)="toggleSort('id')"
                [attr.aria-label]="'Sort by ID'">
                ID {{ getSortIcon('id') }}
              </th>
              <th 
                class="sortable" 
                (click)="toggleSort('customer')"
                [attr.aria-label]="'Sort by Customer Name'">
                Customer {{ getSortIcon('customer') }}
              </th>
              <th>Email</th>
              <th>User status</th>
              <th 
                class="sortable" 
                (click)="toggleSort('total')"
                [attr.aria-label]="'Sort by Total'">
                Total {{ getSortIcon('total') }}
              </th>
              <th 
                class="sortable" 
                (click)="toggleSort('status')"
                [attr.aria-label]="'Sort by Status'">
                Status {{ getSortIcon('status') }}
              </th>
              <th 
                class="sortable" 
                (click)="toggleSort('date')"
                [attr.aria-label]="'Sort by Date'">
                Date {{ getSortIcon('date') }}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let order of sortedOrders$ | async">
              <tr>
                <td>{{ order.id }}</td>
                <td>{{ order.customer.firstName }} {{ order.customer.lastName }}</td>
                <td>{{ order.customer.email }}</td>
                <td>
                  <span class="user-status-badge" [class.inactive]="order.user && !order.user.active">
                    {{ order.user?.active !== false ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ order.total | currency:'EUR' }}</td>
                <td>
                  <span class="status-badge" [class]="'status-' + order.status">
                    {{ order.status }}
                  </span>
                </td>
                <td>{{ order.createdAt | date:'short' }}</td>
                <td>
                  <button class="btn-details" (click)="toggleDetails(order.id)">
                    {{ expandedOrderId === order.id ? 'Hide' : 'Details' }}
                  </button>
                  <button class="btn-status" (click)="openStatusUpdate(order)">
                    Change Status
                  </button>
                </td>
              </tr>
              <!-- Order Details Row -->
              <tr *ngIf="expandedOrderId === order.id" class="details-row">
                <td colspan="8">
                  <div class="order-details">
                    <h3>Products in this order:</h3>
                    <ul>
                      <li *ngFor="let item of order.items">
                        {{ item.product.title }} -
                        Quantity: {{ item.quantity }} -
                        Price: {{ item.unit_price | currency:'EUR' }}
                      </li>
                    </ul>

                    <h3>Shipping address:</h3>
                    <p>{{ order.address.street }}, {{ order.address.city }}, {{ order.address.zip }}</p>

                    <h3 *ngIf="order.billing_address">Billing address:</h3>
                    <p *ngIf="order.billing_address">
                      {{ order.billing_address.full_name }}<br>
                      {{ order.billing_address.street }}, {{ order.billing_address.city }}, {{ order.billing_address.zip }}<br>
                      {{ order.billing_address.country }}
                      <span *ngIf="order.billing_address.vat_number"> - VAT: {{ order.billing_address.vat_number }}</span>
                    </p>

                    <h3 *ngIf="order.payment_method">Payment:</h3>
                    <p *ngIf="order.payment_method">
                      Method: {{ order.payment_method }}<br>
                      <span *ngIf="order.card_brand && order.card_last4">
                        Card: {{ order.card_brand }} **** {{ order.card_last4 }}
                      </span>
                    </p>
                  </div>
                </td>
              </tr>
            </ng-container>
          </tbody>
        </table>
      </div>

      <!-- Status Update Modal -->
      <div class="modal" *ngIf="selectedOrder">
        <div class="modal-content">
          <h2>Update Order Status #{{ selectedOrder.id }}</h2>
          <div class="form-group">
            <label>Status:</label>
            <select [(ngModel)]="newStatus">
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" (click)="updateStatus()">Update</button>
            <button class="btn-secondary" (click)="closeModal()">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-management {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Back navigation link */
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--mat-sys-primary);
      text-decoration: none;
      font-size: 0.95rem;
      margin-bottom: 1rem;
      padding: 0.5rem 0;
      transition: opacity 0.2s;
    }

    .back-link:hover {
      opacity: 0.8;
    }

    .back-arrow {
      font-size: 1.2rem;
    }

    h1 {
      margin-bottom: 2rem;
      color: var(--mat-sys-on-surface);
    }

    .filters {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: var(--mat-sys-surface-container);
      border-radius: 8px;

      label {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: var(--mat-sys-on-surface);
        font-weight: 500;
      }

      select {
        padding: 0.5rem 1rem;
        border: 1px solid var(--mat-sys-outline);
        border-radius: 4px;
        background: var(--mat-sys-surface);
        color: var(--mat-sys-on-surface);
        font-size: 0.95rem;
        cursor: pointer;

        &:hover {
          border-color: var(--mat-sys-primary);
        }

        &:focus {
          outline: 2px solid var(--mat-sys-primary);
          outline-offset: 2px;
        }
      }
    }

    .orders-list {
      background: var(--mat-sys-surface);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border: 1px solid var(--mat-sys-outline-variant);
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      color: var(--mat-sys-on-surface);
    }

    th {
      background: var(--mat-sys-surface-container);
      font-weight: bold;
      color: var(--mat-sys-on-surface);
      
      &.sortable {
        cursor: pointer;
        user-select: none;
        transition: background-color 0.2s;

        &:hover {
          background: var(--mat-sys-surface-container-high);
        }
      }
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: bold;
    }

    .status-pending { background: #f39c12; color: white; }
    .status-paid { background: #2ecc71; color: white; }
    .status-processing { background: #3498db; color: white; }
    .status-shipped { background: #9b59b6; color: white; }
    .status-delivered { background: #27ae60; color: white; }
    .status-cancelled { background: #e74c3c; color: white; }

    .user-status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: bold;
      background: #27ae60;
      color: white;

      &.inactive {
        background: #95a5a6;
        color: white;
      }
    }

    .btn-details, .btn-status {
      padding: 0.5rem 1rem;
      margin-right: 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .btn-details {
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
    }

    .btn-details:hover { opacity: 0.9; }

    .btn-status {
      background: #f39c12;
      color: white;
    }

    .btn-status:hover { background: #e67e22; }

    .details-row td {
      background: var(--mat-sys-surface-container);
    }

    .order-details {
      padding: 1rem;
    }

    .order-details h3 {
      margin-top: 0;
      color: var(--mat-sys-on-surface);
    }

    .order-details ul {
      list-style: none;
      padding: 0;
    }

    .order-details li {
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      color: var(--mat-sys-on-surface);
    }

    .order-details p {
      color: var(--mat-sys-on-surface);
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: var(--mat-sys-surface);
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      border: 1px solid var(--mat-sys-outline-variant);
    }

    .modal-content h2 {
      margin-top: 0;
      color: var(--mat-sys-on-surface);
    }

    .form-group {
      margin: 1.5rem 0;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: var(--mat-sys-on-surface-variant);
    }

    .form-group select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--mat-sys-outline);
      border-radius: 4px;
      font-size: 1rem;
      background: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      flex: 1;
    }

    .btn-primary {
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
    }

    .btn-primary:hover { opacity: 0.9; }

    .btn-secondary {
      background: var(--mat-sys-outline);
      color: var(--mat-sys-on-surface);
    }

    .btn-secondary:hover { opacity: 0.9; }
  `]
})
export class OrdersManagement implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private notify = inject(NotificationService);

  // BehaviorSubject for reactive order list management
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  // Filter state
  userStatusFilter: 'all' | 'active' | 'inactive' = 'all';
  private filteredOrdersSubject = new BehaviorSubject<Order[]>([]);
  filteredOrders$ = this.filteredOrdersSubject.asObservable();

  // Sorting state
  private sortFieldSubject = new BehaviorSubject<SortField>('date');
  private sortDirectionSubject = new BehaviorSubject<SortDirection>('desc');

  sortField$ = this.sortFieldSubject.asObservable();
  sortDirection$ = this.sortDirectionSubject.asObservable();

  sortedOrders$ = combineLatest([
    this.filteredOrders$,
    this.sortField$,
    this.sortDirection$
  ]).pipe(
    map(([orders, field, direction]) => this.sortOrders(orders, field, direction))
  );

  expandedOrderId: number | null = null;
  selectedOrder: Order | null = null;
  newStatus = '';

  ngOnInit() {
    // Reload when navigating back to this route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.loadOrders());

    this.loadOrders();
  }

  loadOrders() {
    // Pull all orders for admin view
    this.orderService.getAllOrders().pipe(
      tap(orders => {
        this.ordersSubject.next(orders);
        this.applyFilters();
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  applyFilters(): void {
    const orders = this.ordersSubject.value;
    let filtered = orders;

    if (this.userStatusFilter === 'active') {
      filtered = orders.filter(order => order.user?.active !== false);
    } else if (this.userStatusFilter === 'inactive') {
      filtered = orders.filter(order => order.user?.active === false);
    }

    this.filteredOrdersSubject.next(filtered);
  }

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

  getSortIcon(field: SortField): string {
    const currentField = this.sortFieldSubject.value;
    const currentDirection = this.sortDirectionSubject.value;
    
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
        case 'customer':
          const nameA = `${a.customer.firstName} ${a.customer.lastName}`.toLowerCase();
          const nameB = `${b.customer.firstName} ${b.customer.lastName}`.toLowerCase();
          comparison = nameA.localeCompare(nameB);
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

  toggleDetails(orderId?: number) {
    // Expand/collapse the details row for a specific order
    if (orderId == null) return;
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  openStatusUpdate(order: Order) {
    // Open modal and preload current status
    this.selectedOrder = order;
    // Default to empty string if status is missing to satisfy strict typing
    this.newStatus = order.status ?? '';
  }

  updateStatus() {
    // Persist new status then refresh list and close modal
    if (!this.selectedOrder?.id) return;
    this.orderService.updateOrderStatus(this.selectedOrder.id, this.newStatus).subscribe(() => {
      this.loadOrders();
      this.closeModal();
      this.notify.success('Order status updated successfully!');
    });
  }

  closeModal() {
    // Reset modal state
    this.selectedOrder = null;
    this.newStatus = '';
  }
}
