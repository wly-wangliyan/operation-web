import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFeesEditComponent } from './work-fees-edit.component';

describe('WorkFeesEditComponent', () => {
  let component: WorkFeesEditComponent;
  let fixture: ComponentFixture<WorkFeesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkFeesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFeesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
