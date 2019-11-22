import { TestBed } from '@angular/core/testing';

import { ProjectManagemantHttpService } from './project-managemant-http.service';

describe('ProjectManagemantHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectManagemantHttpService = TestBed.get(ProjectManagemantHttpService);
    expect(service).toBeTruthy();
  });
});
