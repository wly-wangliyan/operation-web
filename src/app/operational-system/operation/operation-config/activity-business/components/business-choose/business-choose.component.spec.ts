import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessChooseComponent } from './business-choose.component';

describe('BusinessChooseComponent', () => {
  let component: BusinessChooseComponent;
  let fixture: ComponentFixture<BusinessChooseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessChooseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessChooseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
