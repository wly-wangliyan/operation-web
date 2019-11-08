import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseLabelComponent } from './choose-label.component';

describe('ChooseLabelComponent', () => {
  let component: ChooseLabelComponent;
  let fixture: ComponentFixture<ChooseLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
