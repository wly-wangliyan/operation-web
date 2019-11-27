import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsOrderRemarkComponent } from './goods-order-remark.component';

describe('GoodsOrderRemarkComponent', () => {
  let component: GoodsOrderRemarkComponent;
  let fixture: ComponentFixture<GoodsOrderRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsOrderRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsOrderRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
