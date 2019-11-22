import { TestBed } from '@angular/core/testing';

import { MaintenanceManualHttpService } from './maintenance-manual-http.service';

describe('MaintenanceManualHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaintenanceManualHttpService = TestBed.get(MaintenanceManualHttpService);
    expect(service).toBeTruthy();
  });
});
