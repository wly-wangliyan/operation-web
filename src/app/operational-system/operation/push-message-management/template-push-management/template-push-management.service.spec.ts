import { TestBed } from '@angular/core/testing';

import { TemplatePushManagementService } from './template-push-management.service';

describe('TemplatePushManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TemplatePushManagementService = TestBed.get(TemplatePushManagementService);
    expect(service).toBeTruthy();
  });
});
