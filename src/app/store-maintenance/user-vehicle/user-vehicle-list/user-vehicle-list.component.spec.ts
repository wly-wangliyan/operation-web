import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVehicleListComponent } from './user-vehicle-list.component';

describe('UserVehicleListComponent', () => {
  let component: UserVehicleListComponent;
  let fixture: ComponentFixture<UserVehicleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserVehicleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
