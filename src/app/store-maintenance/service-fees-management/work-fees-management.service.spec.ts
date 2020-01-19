import { TestBed } from '@angular/core/testing';

import { WorkFeesManagementService } from './work-fees-management.service';

describe('WorkFeesManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkFeesManagementService = TestBed.get(WorkFeesManagementService);
    expect(service).toBeTruthy();
  });
});
