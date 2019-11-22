import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationConfigComponent } from './operation-config.component';

describe('OperationConfigComponent', () => {
  let component: OperationConfigComponent;
  let fixture: ComponentFixture<OperationConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
