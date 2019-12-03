import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushManagementComponent } from './push-management.component';

describe('PushManagementComponent', () => {
  let component: PushManagementComponent;
  let fixture: ComponentFixture<PushManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
