import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MxParkingComponent } from './mx-parking.component';

describe('MxParkingComponent', () => {
  let component: MxParkingComponent;
  let fixture: ComponentFixture<MxParkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MxParkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MxParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
