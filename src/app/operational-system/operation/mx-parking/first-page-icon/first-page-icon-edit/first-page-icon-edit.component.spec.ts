import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPageIconAddComponent } from './first-page-icon-edit.component';

describe('FirstPageIconAddComponent', () => {
  let component: FirstPageIconAddComponent;
  let fixture: ComponentFixture<FirstPageIconAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstPageIconAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstPageIconAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
