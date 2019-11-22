import { TestBed } from '@angular/core/testing';

import { ActivityConfigService } from './activity-config.service';

describe('ActivityConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityConfigService = TestBed.get(ActivityConfigService);
    expect(service).toBeTruthy();
  });
});
