import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePushDetailComponent } from './template-push-detail.component';

describe('TemplatePushDetailComponent', () => {
  let component: TemplatePushDetailComponent;
  let fixture: ComponentFixture<TemplatePushDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatePushDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePushDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
