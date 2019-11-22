import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementSettingComponent } from './management-setting.component';

describe('ManagementSettingComponent', () => {
  let component: ManagementSettingComponent;
  let fixture: ComponentFixture<ManagementSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
