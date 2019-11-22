import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsOrderDeliveryComponent } from './goods-order-delivery.component';

describe('GoodsOrderDeliveryComponent', () => {
  let component: GoodsOrderDeliveryComponent;
  let fixture: ComponentFixture<GoodsOrderDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsOrderDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsOrderDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
