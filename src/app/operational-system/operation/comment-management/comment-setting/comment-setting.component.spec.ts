import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentSettingComponent } from './comment-setting.component';

describe('CommentSettingComponent', () => {
  let component: CommentSettingComponent;
  let fixture: ComponentFixture<CommentSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
