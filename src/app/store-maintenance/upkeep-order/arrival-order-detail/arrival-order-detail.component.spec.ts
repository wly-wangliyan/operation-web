import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalOrderDetailComponent } from './arrival-order-detail.component';

describe('ArrivalOrderDetailComponent', () => {
  let component: ArrivalOrderDetailComponent;
  let fixture: ComponentFixture<ArrivalOrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrivalOrderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrivalOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
