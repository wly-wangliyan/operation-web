import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsOrderListComponent } from './goods-order-list.component';

describe('GoodsOrderListComponent', () => {
  let component: GoodsOrderListComponent;
  let fixture: ComponentFixture<GoodsOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
