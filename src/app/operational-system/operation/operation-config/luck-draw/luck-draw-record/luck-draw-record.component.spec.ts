import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuckDrawRecordComponent } from './luck-draw-record.component';

describe('LuckDrawRecordComponent', () => {
  let component: LuckDrawRecordComponent;
  let fixture: ComponentFixture<LuckDrawRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuckDrawRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuckDrawRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
