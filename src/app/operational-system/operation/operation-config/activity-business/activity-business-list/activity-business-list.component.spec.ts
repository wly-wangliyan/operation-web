import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBusinessListComponent } from './activity-business-list.component';

describe('ActivityBusinessListComponent', () => {
  let component: ActivityBusinessListComponent;
  let fixture: ComponentFixture<ActivityBusinessListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityBusinessListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityBusinessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
