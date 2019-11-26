import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMultiBrandFirmComponent } from './select-multi-brand-firm.component';

describe('SelectMultiBrandFirmComponent', () => {
  let component: SelectMultiBrandFirmComponent;
  let fixture: ComponentFixture<SelectMultiBrandFirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMultiBrandFirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMultiBrandFirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
