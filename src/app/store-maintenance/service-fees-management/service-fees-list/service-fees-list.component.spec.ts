import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceFeesListComponent } from './service-fees-list.component';

describe('ServiceFeesListComponent', () => {
  let component: ServiceFeesListComponent;
  let fixture: ComponentFixture<ServiceFeesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceFeesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFeesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
