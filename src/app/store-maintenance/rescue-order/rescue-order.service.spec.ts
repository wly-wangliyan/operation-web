import { TestBed } from '@angular/core/testing';

import { RescueOrderService } from './rescue-order.service';

describe('RescueOrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RescueOrderService = TestBed.get(RescueOrderService);
    expect(service).toBeTruthy();
  });
});
