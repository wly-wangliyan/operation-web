import { TestBed } from '@angular/core/testing';

import { AccessoryLibraryService } from './accessory-library.service';

describe('AccessoryLibraryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccessoryLibraryService = TestBed.get(AccessoryLibraryService);
    expect(service).toBeTruthy();
  });
});
