import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandManagementComponent } from './brand-management.component';

describe('BrandManagementComponent', () => {
  let component: BrandManagementComponent;
  let fixture: ComponentFixture<BrandManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
