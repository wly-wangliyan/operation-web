import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExemptionEntryComponent } from './exemption-entry.component';

describe('ExemptionEntryComponent', () => {
  let component: ExemptionEntryComponent;
  let fixture: ComponentFixture<ExemptionEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExemptionEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExemptionEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
