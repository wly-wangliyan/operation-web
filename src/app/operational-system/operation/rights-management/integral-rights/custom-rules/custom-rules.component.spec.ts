import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRulesComponent } from './custom-rules.component';

describe('CustomRulesComponent', () => {
  let component: CustomRulesComponent;
  let fixture: ComponentFixture<CustomRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
