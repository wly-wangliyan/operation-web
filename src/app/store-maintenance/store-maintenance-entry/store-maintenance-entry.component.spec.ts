import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreMaintenanceEntryComponent } from './store-maintenance-entry.component';

describe('StoreMaintenanceEntryComponent', () => {
  let component: StoreMaintenanceEntryComponent;
  let fixture: ComponentFixture<StoreMaintenanceEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreMaintenanceEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreMaintenanceEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
