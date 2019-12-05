import { TestBed } from '@angular/core/testing';

import { ServiceConfigService } from './service-config.service';

describe('ServiceConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceConfigService = TestBed.get(ServiceConfigService);
    expect(service).toBeTruthy();
  });
});
