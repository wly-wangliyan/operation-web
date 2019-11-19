import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreMaintenanceComponent } from './store-maintenance.component';

describe('StoreMaintenanceComponent', () => {
  let component: StoreMaintenanceComponent;
  let fixture: ComponentFixture<StoreMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
