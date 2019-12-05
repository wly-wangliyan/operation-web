import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderParkingComponent } from './order-parking.component';

describe('ExemptionCoOrderParkingComponentmponent', () => {
  let component: OrderParkingComponent;
  let fixture: ComponentFixture<OrderParkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderParkingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
