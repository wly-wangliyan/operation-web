import { TestBed } from '@angular/core/testing';

import { IntegralRightsHttpService } from './integral-rights-http.service';

describe('IntegralRightsHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntegralRightsHttpService = TestBed.get(IntegralRightsHttpService);
    expect(service).toBeTruthy();
  });
});
