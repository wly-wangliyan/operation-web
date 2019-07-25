import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptBoxComponent } from './prompt-box.component';

describe('PromptBoxComponent', () => {
  let component: PromptBoxComponent;
  let fixture: ComponentFixture<PromptBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
