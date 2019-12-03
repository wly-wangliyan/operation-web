import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyConfigListComponent } from './supply-config-list.component';

describe('SupplyConfigListComponent', () => {
  let component: SupplyConfigListComponent;
  let fixture: ComponentFixture<SupplyConfigListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplyConfigListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
