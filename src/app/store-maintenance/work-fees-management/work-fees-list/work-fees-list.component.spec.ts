import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFeesListComponent } from './work-fees-list.component';

describe('WorkFeesListComponent', () => {
  let component: WorkFeesListComponent;
  let fixture: ComponentFixture<WorkFeesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkFeesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFeesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
