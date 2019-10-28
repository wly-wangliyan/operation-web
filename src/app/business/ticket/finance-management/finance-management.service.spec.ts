import { TestBed } from '@angular/core/testing';

import { FinanceManagementService } from './finance-management.service';

describe('FinanceManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FinanceManagementService = TestBed.get(FinanceManagementService);
    expect(service).toBeTruthy();
  });
});
