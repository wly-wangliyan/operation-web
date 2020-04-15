import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPushComponent } from './add-push.component';

describe('AddPushComponent', () => {
  let component: AddPushComponent;
  let fixture: ComponentFixture<AddPushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPushComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
