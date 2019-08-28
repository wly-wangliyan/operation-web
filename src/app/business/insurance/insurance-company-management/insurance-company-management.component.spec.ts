import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCompanyManagementComponent } from './insurance-company-management.component';

describe('InsuranceCompanyManagementComponent', () => {
  let component: InsuranceCompanyManagementComponent;
  let fixture: ComponentFixture<InsuranceCompanyManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceCompanyManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCompanyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
