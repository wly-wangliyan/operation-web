import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSingleRowBroadcastComponent } from './form-single-row-broadcast.component';

describe('FormSingleRowBroadcastComponent', () => {
  let component: FormSingleRowBroadcastComponent;
  let fixture: ComponentFixture<FormSingleRowBroadcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSingleRowBroadcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSingleRowBroadcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
