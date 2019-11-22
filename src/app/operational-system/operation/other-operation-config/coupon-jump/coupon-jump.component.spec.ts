import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponJumpComponent } from './coupon-jump.component';

describe('CouponJumpComponent', () => {
  let component: CouponJumpComponent;
  let fixture: ComponentFixture<CouponJumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponJumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponJumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
