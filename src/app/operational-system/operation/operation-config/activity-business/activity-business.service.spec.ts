import { TestBed } from '@angular/core/testing';

import { ActivityBusinessService } from './activity-business.service';

describe('ActivityBusinessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityBusinessService = TestBed.get(ActivityBusinessService);
    expect(service).toBeTruthy();
  });
});
