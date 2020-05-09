import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushLogListComponent } from './push-log-list.component';

describe('PushLogListComponent', () => {
  let component: PushLogListComponent;
  let fixture: ComponentFixture<PushLogListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushLogListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
