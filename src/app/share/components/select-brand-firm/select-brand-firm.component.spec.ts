import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBrandFirmComponent } from './select-brand-firm.component';

describe('SelectBrandFirmComponent', () => {
  let component: SelectBrandFirmComponent;
  let fixture: ComponentFixture<SelectBrandFirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBrandFirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBrandFirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
