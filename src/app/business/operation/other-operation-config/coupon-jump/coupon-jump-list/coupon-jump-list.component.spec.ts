import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponJumpListComponent } from './coupon-jump-list.component';

describe('CouponJumpListComponent', () => {
  let component: CouponJumpListComponent;
  let fixture: ComponentFixture<CouponJumpListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponJumpListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponJumpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
