import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelManagementComponent } from './label-management.component';

describe('LabelManagementComponent', () => {
  let component: LabelManagementComponent;
  let fixture: ComponentFixture<LabelManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
