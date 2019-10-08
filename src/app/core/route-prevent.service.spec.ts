import { TestBed } from '@angular/core/testing';

import { RoutePreventService } from './route-prevent.service';

describe('RoutePreventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoutePreventService = TestBed.get(RoutePreventService);
    expect(service).toBeTruthy();
  });
});
