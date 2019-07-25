import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedMenuComponent } from './expanded-menu.component';

describe('ExpandedMenuComponent', () => {
  let component: ExpandedMenuComponent;
  let fixture: ComponentFixture<ExpandedMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandedMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
