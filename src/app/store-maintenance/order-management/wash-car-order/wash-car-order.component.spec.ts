import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashOrderComponent } from './wash-car-order.component';

describe('WashOrderComponent', () => {
  let component: WashOrderComponent;
  let fixture: ComponentFixture<WashOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WashOrderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
