import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderParkingMainComponent } from './order-parking-main.component';

describe('OrderParkingMainComponent', () => {
  let component: OrderParkingMainComponent;
  let fixture: ComponentFixture<OrderParkingMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderParkingMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderParkingMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
