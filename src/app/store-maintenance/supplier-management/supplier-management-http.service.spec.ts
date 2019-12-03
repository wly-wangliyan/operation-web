import { TestBed } from '@angular/core/testing';

import { SupplierManagementHttpService } from './supplier-management-http.service';

describe('SupplierManagementHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupplierManagementHttpService = TestBed.get(SupplierManagementHttpService);
    expect(service).toBeTruthy();
  });
});
