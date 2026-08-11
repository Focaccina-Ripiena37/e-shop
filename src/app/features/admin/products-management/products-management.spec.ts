import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { ProductsManagement } from './products-management';

describe('ProductsManagement', () => {
  let component: ProductsManagement;
  let fixture: ComponentFixture<ProductsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsManagement],
      providers: [provideRouter([]), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
