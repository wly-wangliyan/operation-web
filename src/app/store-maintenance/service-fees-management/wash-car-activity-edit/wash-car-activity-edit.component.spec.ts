import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashCarActivityEditComponent } from './wash-car-activity-edit.component';

describe('WashCarActivityEditComponent', () => {
  let component: WashCarActivityEditComponent;
  let fixture: ComponentFixture<WashCarActivityEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashCarActivityEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashCarActivityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
