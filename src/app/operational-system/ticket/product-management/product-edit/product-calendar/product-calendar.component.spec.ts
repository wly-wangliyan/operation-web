import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCalendarComponent } from './product-calendar.component';

describe('ProductCalendarComponent', () => {
  let component: ProductCalendarComponent;
  let fixture: ComponentFixture<ProductCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
