import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePushListComponent } from './template-push-list.component';

describe('TemplatePushListComponent', () => {
  let component: TemplatePushListComponent;
  let fixture: ComponentFixture<TemplatePushListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatePushListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePushListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
