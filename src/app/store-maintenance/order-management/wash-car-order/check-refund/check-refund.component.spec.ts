import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckRefundComponent } from './check-refund.component';

describe('CheckRefundComponent', () => {
  let component: CheckRefundComponent;
  let fixture: ComponentFixture<CheckRefundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckRefundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
