import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationConfigurationDetailComponent } from './operation-configuration-detail.component';

describe('OperationConfigurationDetailComponent', () => {
  let component: OperationConfigurationDetailComponent;
  let fixture: ComponentFixture<OperationConfigurationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationConfigurationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationConfigurationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
