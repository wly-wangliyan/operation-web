import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityConfigComponent } from './activity-config.component';

describe('ActivityConfigComponent', () => {
  let component: ActivityConfigComponent;
  let fixture: ComponentFixture<ActivityConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
