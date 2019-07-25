import { TestBed, inject } from '@angular/core/testing';

import { RouteMonitorService } from './route-monitor.service';

describe('RouteMonitorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteMonitorService]
    });
  });

  it('should be created', inject([RouteMonitorService], (service: RouteMonitorService) => {
    expect(service).toBeTruthy();
  }));
});
