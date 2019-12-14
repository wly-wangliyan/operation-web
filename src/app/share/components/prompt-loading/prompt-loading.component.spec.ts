import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptLoadingComponent } from './prompt-loading.component';

describe('PromptLoadingComponent', () => {
  let component: PromptLoadingComponent;
  let fixture: ComponentFixture<PromptLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
