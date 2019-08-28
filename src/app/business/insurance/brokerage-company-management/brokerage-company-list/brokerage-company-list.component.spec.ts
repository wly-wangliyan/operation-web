import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageCompanyListComponent } from './brokerage-company-list.component';

describe('BrokerageCompanyListComponent', () => {
  let component: BrokerageCompanyListComponent;
  let fixture: ComponentFixture<BrokerageCompanyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerageCompanyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerageCompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
