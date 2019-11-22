import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageCompanyManagementComponent } from './brokerage-company-management.component';

describe('BrokerageCompanyManagementComponent', () => {
  let component: BrokerageCompanyManagementComponent;
  let fixture: ComponentFixture<BrokerageCompanyManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerageCompanyManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerageCompanyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
