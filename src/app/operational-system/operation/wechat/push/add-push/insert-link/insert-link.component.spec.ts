import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertLinkComponent } from './insert-link.component';

describe('InsertLinkComponent', () => {
  let component: InsertLinkComponent;
  let fixture: ComponentFixture<InsertLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
