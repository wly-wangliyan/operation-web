import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsOrderManagementComponent } from './goods-order-management.component';

describe('GoodsOrderManagementComponent', () => {
  let component: GoodsOrderManagementComponent;
  let fixture: ComponentFixture<GoodsOrderManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsOrderManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsOrderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
