import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceDecorationEditComponent } from './interface-decoration-edit.component';

describe('InterfaceDecorationEditComponent', () => {
  let component: InterfaceDecorationEditComponent;
  let fixture: ComponentFixture<InterfaceDecorationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfaceDecorationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceDecorationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
