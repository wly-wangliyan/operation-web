import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothManagementComponent } from './booth-management.component';

describe('BoothManagementComponent', () => {
  let component: BoothManagementComponent;
  let fixture: ComponentFixture<BoothManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoothManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoothManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
