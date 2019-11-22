import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeCenterComponent } from './notice-center.component';

describe('NoticeCenterComponent', () => {
  let component: NoticeCenterComponent;
  let fixture: ComponentFixture<NoticeCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
