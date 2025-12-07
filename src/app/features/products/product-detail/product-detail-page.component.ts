import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AsyncPipe, CurrencyPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { switchMap, map } from 'rxjs';
import { ProductService } from '../../../core/product.service';

@Component({
    selector: 'app-product-detail-page',
    standalone: true,
    templateUrl: './product-detail-page.html',
    styleUrls: ['./product-detail-page.scss'],
    imports: [RouterModule, NgIf, AsyncPipe, CurrencyPipe, MatCardModule, MatButtonModule],
})
export class ProductDetailPageComponent {
    private route = inject(ActivatedRoute);
    private svc = inject(ProductService);

    readonly product$ = this.route.paramMap.pipe(
        map(params => params.get('id') as string),
        switchMap(id => this.svc.getById(id)),
    );
}
