import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTypeManagementComponent } from './vehicle-type-management.component';

describe('VehicleTypeManagementComponent', () => {
  let component: VehicleTypeManagementComponent;
  let fixture: ComponentFixture<VehicleTypeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTypeManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
