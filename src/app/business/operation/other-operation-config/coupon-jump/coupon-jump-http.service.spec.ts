import { TestBed } from '@angular/core/testing';

import { CouponJumpHttpService } from './coupon-jump-http.service';

describe('CouponJumpHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CouponJumpHttpService = TestBed.get(CouponJumpHttpService);
    expect(service).toBeTruthy();
  });
});
