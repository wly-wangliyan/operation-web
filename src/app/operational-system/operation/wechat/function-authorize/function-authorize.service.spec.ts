import { TestBed } from '@angular/core/testing';

import { FunctionAuthorizeService } from './function-authorize.service';

describe('FunctionAuthorizeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FunctionAuthorizeService = TestBed.get(FunctionAuthorizeService);
    expect(service).toBeTruthy();
  });
});
