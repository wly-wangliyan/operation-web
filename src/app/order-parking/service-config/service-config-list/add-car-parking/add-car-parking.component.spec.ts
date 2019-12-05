import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarParkingComponent } from './add-car-parking.component';

describe('AddCarParkingComponent', () => {
  let component: AddCarParkingComponent;
  let fixture: ComponentFixture<AddCarParkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCarParkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCarParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
