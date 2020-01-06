import { TestBed } from '@angular/core/testing';

import { ExpenseHttpService } from './expense-http.service';

describe('ExpenseHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExpenseHttpService = TestBed.get(ExpenseHttpService);
    expect(service).toBeTruthy();
  });
});
