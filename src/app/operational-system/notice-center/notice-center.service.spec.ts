import { TestBed } from '@angular/core/testing';

import { NoticeCenterService } from './notice-center.service';

describe('NoticeCenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoticeCenterService = TestBed.get(NoticeCenterService);
    expect(service).toBeTruthy();
  });
});
