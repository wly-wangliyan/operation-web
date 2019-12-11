import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RescueFeesEditComponent } from './rescue-fees-edit.component';

describe('RescueFeesEditComponent', () => {
  let component: RescueFeesEditComponent;
  let fixture: ComponentFixture<RescueFeesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RescueFeesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RescueFeesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
