import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBusinessEditComponent } from './activity-business-edit.component';

describe('ActivityBusinessEditComponent', () => {
  let component: ActivityBusinessEditComponent;
  let fixture: ComponentFixture<ActivityBusinessEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityBusinessEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityBusinessEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
