import { TestBed } from '@angular/core/testing';

import { GarageGiftService } from './garage-gift.service';

describe('GarageGiftService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GarageGiftService = TestBed.get(GarageGiftService);
    expect(service).toBeTruthy();
  });
});
