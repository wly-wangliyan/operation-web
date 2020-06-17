import { TestBed } from '@angular/core/testing';

import { UserVehicleHttpService } from './user-vehicle-http.service';

describe('UserVehicleHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserVehicleHttpService = TestBed.get(UserVehicleHttpService);
    expect(service).toBeTruthy();
  });
});
