import { TestBed } from '@angular/core/testing';

import { WashOrderService } from './wash-car-order.service';

describe('WashOrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WashOrderService = TestBed.get(WashOrderService);
    expect(service).toBeTruthy();
  });
});
