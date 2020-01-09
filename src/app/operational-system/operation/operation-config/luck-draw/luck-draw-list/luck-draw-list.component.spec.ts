import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuckDrawListComponent } from './luck-draw-list.component';

describe('LuckDrawListComponent', () => {
  let component: LuckDrawListComponent;
  let fixture: ComponentFixture<LuckDrawListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuckDrawListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuckDrawListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
