import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { OrdersManagement } from './orders-management';

describe('OrdersManagement', () => {
  let component: OrdersManagement;
  let fixture: ComponentFixture<OrdersManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersManagement],
      providers: [provideRouter([]), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
