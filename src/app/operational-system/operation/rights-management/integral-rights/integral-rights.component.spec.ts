import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegralRightsComponent } from './integral-rights.component';

describe('IntegralRightsComponent', () => {
  let component: IntegralRightsComponent;
  let fixture: ComponentFixture<IntegralRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegralRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegralRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
