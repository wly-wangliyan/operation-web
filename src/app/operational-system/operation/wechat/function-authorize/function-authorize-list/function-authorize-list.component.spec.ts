import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionAuthorizeListComponent } from './function-authorize-list.component';

describe('FunctionAuthorizeListComponent', () => {
  let component: FunctionAuthorizeListComponent;
  let fixture: ComponentFixture<FunctionAuthorizeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionAuthorizeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionAuthorizeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
