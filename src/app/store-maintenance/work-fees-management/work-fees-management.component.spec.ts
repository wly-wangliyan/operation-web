import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFeesManagementComponent } from './work-fees-management.component';

describe('WorkFeesManagementComponent', () => {
  let component: WorkFeesManagementComponent;
  let fixture: ComponentFixture<WorkFeesManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkFeesManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFeesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
