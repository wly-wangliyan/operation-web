import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLeftRightLayout1Component } from './form-left-right-layout1.component';

describe('FormLeftRightLayout1Component', () => {
  let component: FormLeftRightLayout1Component;
  let fixture: ComponentFixture<FormLeftRightLayout1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLeftRightLayout1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLeftRightLayout1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
