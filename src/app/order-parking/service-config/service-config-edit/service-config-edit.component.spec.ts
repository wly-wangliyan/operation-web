import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceConfigEditComponent } from './service-config-edit.component';

describe('ServiceConfigEditComponent', () => {
  let component: ServiceConfigEditComponent;
  let fixture: ComponentFixture<ServiceConfigEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceConfigEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceConfigEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
