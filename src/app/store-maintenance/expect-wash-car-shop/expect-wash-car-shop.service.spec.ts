import { TestBed } from '@angular/core/testing';

import { ExpectWashCarShopService } from './expect-wash-car-shop.service';

describe('ExpectWashCarShopService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExpectWashCarShopService = TestBed.get(ExpectWashCarShopService);
    expect(service).toBeTruthy();
  });
});
