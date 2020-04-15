import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionAuthorizeComponent } from './function-authorize.component';

describe('FunctionAuthorizeComponent', () => {
  let component: FunctionAuthorizeComponent;
  let fixture: ComponentFixture<FunctionAuthorizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionAuthorizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionAuthorizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
