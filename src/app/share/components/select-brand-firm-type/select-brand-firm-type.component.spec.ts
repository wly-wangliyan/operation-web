import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBrandFirmTypeComponent } from './select-brand-firm-type.component';

describe('SelectBrandFirmComponent', () => {
  let component: SelectBrandFirmTypeComponent;
  let fixture: ComponentFixture<SelectBrandFirmTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBrandFirmTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBrandFirmTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
