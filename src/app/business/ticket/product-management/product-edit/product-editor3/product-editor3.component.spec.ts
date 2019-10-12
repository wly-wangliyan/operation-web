import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditor3Component } from './product-editor3.component';

describe('ProductEditor3Component', () => {
  let component: ProductEditor3Component;
  let fixture: ComponentFixture<ProductEditor3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductEditor3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditor3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
