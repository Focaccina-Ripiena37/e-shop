import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap, map } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order';

@Component({
  selector: 'app-order-detail-page',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, CurrencyPipe, DatePipe, RouterModule],
  templateUrl: './order-detail-page.html',
  styleUrls: ['./order-detail-page.scss']
})
export class OrderDetailPage {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order$ = this.route.paramMap.pipe(
    map(params => Number(params.get('id'))),
    switchMap(id => this.orderService.getOrder(id))
  );
}
