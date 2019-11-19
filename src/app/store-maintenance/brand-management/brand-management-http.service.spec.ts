import { TestBed } from '@angular/core/testing';

import { BrandManagementHttpService } from './brand-management-http.service';

describe('BrandManagementHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrandManagementHttpService = TestBed.get(BrandManagementHttpService);
    expect(service).toBeTruthy();
  });
});
