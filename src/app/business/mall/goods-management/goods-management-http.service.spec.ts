import { TestBed } from '@angular/core/testing';

import { GoodsManagementHttpService } from './goods-management-http.service';

describe('GoodsManagementHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoodsManagementHttpService = TestBed.get(GoodsManagementHttpService);
    expect(service).toBeTruthy();
  });
});
