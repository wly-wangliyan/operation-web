import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCompanyListComponent } from './insurance-company-list.component';

describe('InsuranceCompanyListComponent', () => {
  let component: InsuranceCompanyListComponent;
  let fixture: ComponentFixture<InsuranceCompanyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceCompanyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
