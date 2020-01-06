import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSingleLineScrollComponent } from './form-single-line-scroll.component';

describe('FormSingleLineScrollComponent', () => {
  let component: FormSingleLineScrollComponent;
  let fixture: ComponentFixture<FormSingleLineScrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSingleLineScrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSingleLineScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
