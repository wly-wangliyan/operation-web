import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RescueOrderComponent } from './rescue-order.component';

describe('RescueOrderComponent', () => {
  let component: RescueOrderComponent;
  let fixture: ComponentFixture<RescueOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RescueOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RescueOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
