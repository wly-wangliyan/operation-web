import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFunctionComponent } from './advanced-function.component';

describe('AdvancedFunctionComponent', () => {
  let component: AdvancedFunctionComponent;
  let fixture: ComponentFixture<AdvancedFunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedFunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
