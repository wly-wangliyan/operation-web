import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushListComponent } from './push-list.component';

describe('PushListComponent', () => {
  let component: PushListComponent;
  let fixture: ComponentFixture<PushListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
