import { TestBed } from '@angular/core/testing';

import { IntegralOrderHttpService } from './integral-order-http.service';

describe('IntegralOrderHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntegralOrderHttpService = TestBed.get(IntegralOrderHttpService);
    expect(service).toBeTruthy();
  });
});
