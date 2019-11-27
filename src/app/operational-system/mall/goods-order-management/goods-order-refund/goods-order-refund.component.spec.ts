import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsOrderRefundComponent } from './goods-order-refund.component';

describe('GoodsOrderRefundComponent', () => {
  let component: GoodsOrderRefundComponent;
  let fixture: ComponentFixture<GoodsOrderRefundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsOrderRefundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsOrderRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
