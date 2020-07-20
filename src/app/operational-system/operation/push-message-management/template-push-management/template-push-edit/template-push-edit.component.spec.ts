import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePushEditComponent } from './template-push-edit.component';

describe('TemplatePushEditComponent', () => {
  let component: TemplatePushEditComponent;
  let fixture: ComponentFixture<TemplatePushEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatePushEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePushEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
