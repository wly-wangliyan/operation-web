import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceFeesManagementComponent } from './service-fees-management.component';

describe('ServiceFeesManagementComponent', () => {
  let component: ServiceFeesManagementComponent;
  let fixture: ComponentFixture<ServiceFeesManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceFeesManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFeesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
