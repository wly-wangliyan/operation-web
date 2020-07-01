import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegralOrderComponent } from './integral-order.component';

describe('IntegralOrderComponent', () => {
  let component: IntegralOrderComponent;
  let fixture: ComponentFixture<IntegralOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegralOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegralOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
