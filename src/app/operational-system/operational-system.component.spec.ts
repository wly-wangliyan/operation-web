import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalSystemComponent } from './operational-system.component';

describe('OperationalSystemComponent', () => {
  let component: OperationalSystemComponent;
  let fixture: ComponentFixture<OperationalSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationalSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationalSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
