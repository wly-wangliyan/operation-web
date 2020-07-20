import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePushManagementComponent } from './template-push-management.component';

describe('TemplatePushManagementComponent', () => {
  let component: TemplatePushManagementComponent;
  let fixture: ComponentFixture<TemplatePushManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatePushManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePushManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
