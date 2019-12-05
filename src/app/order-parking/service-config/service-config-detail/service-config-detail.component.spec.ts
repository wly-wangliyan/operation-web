import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceConfigDetailComponent } from './service-config-detail.component';

describe('ServiceConfigDetailComponent', () => {
  let component: ServiceConfigDetailComponent;
  let fixture: ComponentFixture<ServiceConfigDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceConfigDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceConfigDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
