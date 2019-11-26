import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExemptionMainComponent } from './exemption-main.component';

describe('ExemptionMainComponent', () => {
  let component: ExemptionMainComponent;
  let fixture: ComponentFixture<ExemptionMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExemptionMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExemptionMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
