import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamineGoodsModalComponent } from './examine-goods-modal.component';

describe('ExamineGoodsModalComponent', () => {
  let component: ExamineGoodsModalComponent;
  let fixture: ComponentFixture<ExamineGoodsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamineGoodsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamineGoodsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
