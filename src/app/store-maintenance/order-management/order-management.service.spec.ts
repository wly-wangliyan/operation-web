import { TestBed } from '@angular/core/testing';

import { OrderManagementService } from './order-management.service';

describe('OrderManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderManagementService = TestBed.get(OrderManagementService);
    expect(service).toBeTruthy();
  });
});
