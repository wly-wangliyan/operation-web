import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceManualComponent } from './maintenance-manual.component';

describe('MaintenanceManualComponent', () => {
  let component: MaintenanceManualComponent;
  let fixture: ComponentFixture<MaintenanceManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
