import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceConfigListComponent } from './service-config-list.component';

describe('ServiceConfigListComponent', () => {
  let component: ServiceConfigListComponent;
  let fixture: ComponentFixture<ServiceConfigListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceConfigListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
