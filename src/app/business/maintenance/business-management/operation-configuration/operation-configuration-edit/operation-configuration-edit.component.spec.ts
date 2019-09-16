import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationConfigurationEditComponent } from './operation-configuration-edit.component';

describe('OperationConfigurationEditComponent', () => {
  let component: OperationConfigurationEditComponent;
  let fixture: ComponentFixture<OperationConfigurationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationConfigurationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationConfigurationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
