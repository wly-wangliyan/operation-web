import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVehicleTypeGroupComponent } from './search-vehicle-type-group.component';

describe('SearchVehicleTypeGroupComponent', () => {
  let component: SearchVehicleTypeGroupComponent;
  let fixture: ComponentFixture<SearchVehicleTypeGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchVehicleTypeGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVehicleTypeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
