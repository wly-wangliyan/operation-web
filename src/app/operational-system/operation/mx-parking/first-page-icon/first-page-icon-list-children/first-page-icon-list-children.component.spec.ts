import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPageIconListChildrenComponent } from './first-page-icon-list-children.component';

describe('FirstPageIconListChildrenComponent', () => {
  let component: FirstPageIconListChildrenComponent;
  let fixture: ComponentFixture<FirstPageIconListChildrenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstPageIconListChildrenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstPageIconListChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
