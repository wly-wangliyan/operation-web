import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushEditComponent } from './push-edit.component';

describe('PushEditComponent', () => {
  let component: PushEditComponent;
  let fixture: ComponentFixture<PushEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
