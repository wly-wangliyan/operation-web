import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseMallGoodModalComponent } from './choose-mall-good-modal.component';

describe('ChooseMallGoodModalComponent', () => {
  let component: ChooseMallGoodModalComponent;
  let fixture: ComponentFixture<ChooseMallGoodModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseMallGoodModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseMallGoodModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
