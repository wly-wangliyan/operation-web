import { TestBed } from '@angular/core/testing';

import { UserIntegralHttpService } from './user-integral-http.service';

describe('UserIntegralHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserIntegralHttpService = TestBed.get(UserIntegralHttpService);
    expect(service).toBeTruthy();
  });
});
