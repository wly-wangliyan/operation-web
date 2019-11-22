import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsOrderDetailComponent } from './goods-order-detail.component';

describe('GoodsOrderDetailComponent', () => {
  let component: GoodsOrderDetailComponent;
  let fixture: ComponentFixture<GoodsOrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsOrderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
