import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueTimeModalComponent } from './issue-time-modal.component';

describe('IssueTimeModalComponent', () => {
  let component: IssueTimeModalComponent;
  let fixture: ComponentFixture<IssueTimeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueTimeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueTimeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
