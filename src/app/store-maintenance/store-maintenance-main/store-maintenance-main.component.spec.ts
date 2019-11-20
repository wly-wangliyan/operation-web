import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreMaintenanceMainComponent } from './store-maintenance-main.component';

describe('StoreMaintenanceMainComponent', () => {
  let component: StoreMaintenanceMainComponent;
  let fixture: ComponentFixture<StoreMaintenanceMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreMaintenanceMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreMaintenanceMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
