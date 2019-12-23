import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpkeepOrderComponent } from './upkeep-order.component';

describe('UpkeepOrderComponent', () => {
  let component: UpkeepOrderComponent;
  let fixture: ComponentFixture<UpkeepOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpkeepOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpkeepOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
