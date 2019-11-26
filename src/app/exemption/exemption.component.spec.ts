import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExemptionComponent } from './exemption.component';

describe('ExemptionComponent', () => {
  let component: ExemptionComponent;
  let fixture: ComponentFixture<ExemptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExemptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
