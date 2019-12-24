import { TestBed } from '@angular/core/testing';

import { ClassifyManagementHttpService } from './classify-management-http.service';

describe('ClassifyManagementHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClassifyManagementHttpService = TestBed.get(ClassifyManagementHttpService);
    expect(service).toBeTruthy();
  });
});
