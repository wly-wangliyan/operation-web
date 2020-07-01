import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIntegralComponent } from './user-integral.component';

describe('UserIntegralComponent', () => {
  let component: UserIntegralComponent;
  let fixture: ComponentFixture<UserIntegralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserIntegralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserIntegralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
