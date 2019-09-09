import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationConfigurationComponent } from './operation-configuration.component';

describe('OperationConfigurationComponent', () => {
  let component: OperationConfigurationComponent;
  let fixture: ComponentFixture<OperationConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
