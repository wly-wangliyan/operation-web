import { TestBed } from '@angular/core/testing';

import { BannersService } from './banners.service';

describe('BannersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BannersService = TestBed.get(BannersService);
    expect(service).toBeTruthy();
  });
});
