import { TestBed } from '@angular/core/testing';

import { IntegralMallHttpService } from './integral-mall-http.service';

describe('IntegralMallHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntegralMallHttpService = TestBed.get(IntegralMallHttpService);
    expect(service).toBeTruthy();
  });
});
