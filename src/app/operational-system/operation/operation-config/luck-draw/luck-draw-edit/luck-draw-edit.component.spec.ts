import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuckDrawEditComponent } from './luck-draw-edit.component';

describe('LuckDrawEditComponent', () => {
  let component: LuckDrawEditComponent;
  let fixture: ComponentFixture<LuckDrawEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuckDrawEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuckDrawEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
