import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBusinessComponent } from './activity-business.component';

describe('ActivityBusinessComponent', () => {
  let component: ActivityBusinessComponent;
  let fixture: ComponentFixture<ActivityBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
