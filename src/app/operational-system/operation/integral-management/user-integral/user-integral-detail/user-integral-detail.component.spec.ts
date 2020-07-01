import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIntegralDetailComponent } from './user-integral-detail.component';

describe('UserIntegralDetailComponent', () => {
  let component: UserIntegralDetailComponent;
  let fixture: ComponentFixture<UserIntegralDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserIntegralDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserIntegralDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
