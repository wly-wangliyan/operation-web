import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditor1Component } from './product-editor1.component';

describe('ProductEditor1Component', () => {
  let component: ProductEditor1Component;
  let fixture: ComponentFixture<ProductEditor1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductEditor1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditor1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
