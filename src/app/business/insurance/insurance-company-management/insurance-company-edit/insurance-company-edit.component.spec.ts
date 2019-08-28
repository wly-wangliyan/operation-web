import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCompanyEditComponent } from './insurance-company-edit.component';

describe('InsuranceCompanyEditComponent', () => {
  let component: InsuranceCompanyEditComponent;
  let fixture: ComponentFixture<InsuranceCompanyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceCompanyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCompanyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
