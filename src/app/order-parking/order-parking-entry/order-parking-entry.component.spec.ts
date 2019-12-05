import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderParkingEntryComponent } from './order-parking-entry.component';

describe('OrderParkingEntryComponent', () => {
  let component: OrderParkingEntryComponent;
  let fixture: ComponentFixture<OrderParkingEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderParkingEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderParkingEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
