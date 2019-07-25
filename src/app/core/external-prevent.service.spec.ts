import { TestBed } from '@angular/core/testing';

import { ExternalPreventService } from './external-prevent.service';

describe('ExternalPreventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExternalPreventService = TestBed.get(ExternalPreventService);
    expect(service).toBeTruthy();
  });
});
