import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseCommodityComponent } from './choose-commodity.component';

describe('ChooseCommodityComponent', () => {
  let component: ChooseCommodityComponent;
  let fixture: ComponentFixture<ChooseCommodityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseCommodityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
