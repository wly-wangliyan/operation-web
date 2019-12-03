import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageEditComponent } from './garage-edit.component';

describe('GarageEditComponent', () => {
  let component: GarageEditComponent;
  let fixture: ComponentFixture<GarageEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GarageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GarageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
