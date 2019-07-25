import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProCityDistSelectComponent } from './pro-city-dist-select.component';

describe('ProCityDistSelectComponent', () => {
  let component: ProCityDistSelectComponent;
  let fixture: ComponentFixture<ProCityDistSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProCityDistSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProCityDistSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
