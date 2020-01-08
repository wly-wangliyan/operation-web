import { TestBed } from '@angular/core/testing';

import { WashCarServiceConfigService } from './wash-car-service-config.service';

describe('WashCarServiceConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WashCarServiceConfigService = TestBed.get(WashCarServiceConfigService);
    expect(service).toBeTruthy();
  });
});
