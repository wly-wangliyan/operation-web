import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegralManagementComponent } from './integral-management.component';

describe('IntegralManagementComponent', () => {
  let component: IntegralManagementComponent;
  let fixture: ComponentFixture<IntegralManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegralManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegralManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
