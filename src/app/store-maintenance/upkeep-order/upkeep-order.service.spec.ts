import { TestBed } from '@angular/core/testing';

import { UpkeepOrderService } from './upkeep-order.service';

describe('UpkeepOrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpkeepOrderService = TestBed.get(UpkeepOrderService);
    expect(service).toBeTruthy();
  });
});
