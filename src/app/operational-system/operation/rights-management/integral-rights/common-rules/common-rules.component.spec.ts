import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonRulesComponent } from './common-rules.component';

describe('CommonRulesComponent', () => {
  let component: CommonRulesComponent;
  let fixture: ComponentFixture<CommonRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
