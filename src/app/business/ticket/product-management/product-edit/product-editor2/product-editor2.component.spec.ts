import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditor2Component } from './product-editor2.component';

describe('ProductEditor2Component', () => {
  let component: ProductEditor2Component;
  let fixture: ComponentFixture<ProductEditor2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductEditor2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditor2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
