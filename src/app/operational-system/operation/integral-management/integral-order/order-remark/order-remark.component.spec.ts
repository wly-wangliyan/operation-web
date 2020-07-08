import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRemarkComponent } from './order-remark.component';

describe('OrderRemarkComponent', () => {
  let component: OrderRemarkComponent;
  let fixture: ComponentFixture<OrderRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
