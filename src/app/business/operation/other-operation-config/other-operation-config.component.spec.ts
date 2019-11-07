import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherOperationConfigComponent } from './other-operation-config.component';

describe('OtherOperationConfigComponent', () => {
  let component: OtherOperationConfigComponent;
  let fixture: ComponentFixture<OtherOperationConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherOperationConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherOperationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
