import { TestBed } from '@angular/core/testing';

import { TopicManagementHttpService } from './topic-management-http.service';

describe('TopicManagementHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TopicManagementHttpService = TestBed.get(TopicManagementHttpService);
    expect(service).toBeTruthy();
  });
});
