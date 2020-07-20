import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushMessageManagementComponent } from './push-message-management.component';

describe('PushMessageManagementComponent', () => {
  let component: PushMessageManagementComponent;
  let fixture: ComponentFixture<PushMessageManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushMessageManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushMessageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
