import { TestBed } from '@angular/core/testing';

import { ProductLibraryHttpService } from './product-library-http.service';

describe('ProductLibraryHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductLibraryHttpService = TestBed.get(ProductLibraryHttpService);
    expect(service).toBeTruthy();
  });
});
