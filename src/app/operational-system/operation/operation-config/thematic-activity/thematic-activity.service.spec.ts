import { TestBed } from '@angular/core/testing';

import { ThematicActivityService } from './thematic-activity.service';

describe('ThematicActivityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThematicActivityService = TestBed.get(ThematicActivityService);
    expect(service).toBeTruthy();
  });
});
