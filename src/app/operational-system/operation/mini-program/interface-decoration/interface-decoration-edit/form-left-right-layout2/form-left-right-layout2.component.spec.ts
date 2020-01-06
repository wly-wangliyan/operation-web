import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLeftRightLayout2Component } from './form-left-right-layout2.component';

describe('FormLeftRightLayout2Component', () => {
  let component: FormLeftRightLayout2Component;
  let fixture: ComponentFixture<FormLeftRightLayout2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLeftRightLayout2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLeftRightLayout2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
