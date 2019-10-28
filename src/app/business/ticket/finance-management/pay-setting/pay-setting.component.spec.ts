import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaySettingComponent } from './pay-setting.component';

describe('PaySettingComponent', () => {
  let component: PaySettingComponent;
  let fixture: ComponentFixture<PaySettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaySettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
