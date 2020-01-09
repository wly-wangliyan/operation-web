import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeCreateComponent } from './prize-create.component';

describe('PrizeCreateComponent', () => {
  let component: PrizeCreateComponent;
  let fixture: ComponentFixture<PrizeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrizeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrizeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
