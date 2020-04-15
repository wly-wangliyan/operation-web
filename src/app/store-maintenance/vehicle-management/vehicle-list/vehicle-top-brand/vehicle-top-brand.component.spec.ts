import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTopBrandComponent } from './vehicle-top-brand.component';

describe('VehicleTopBrandComponent', () => {
  let component: VehicleTopBrandComponent;
  let fixture: ComponentFixture<VehicleTopBrandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTopBrandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTopBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
