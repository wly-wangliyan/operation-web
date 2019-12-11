import { TestBed } from '@angular/core/testing';

import { ServiceFeesManagementService } from './service-fees-management.service';

describe('ServiceFeesManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceFeesManagementService = TestBed.get(ServiceFeesManagementService);
    expect(service).toBeTruthy();
  });
});
