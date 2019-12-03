import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageManagementComponent } from './garage-management.component';

describe('GarageManagementComponent', () => {
  let component: GarageManagementComponent;
  let fixture: ComponentFixture<GarageManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GarageManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GarageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
