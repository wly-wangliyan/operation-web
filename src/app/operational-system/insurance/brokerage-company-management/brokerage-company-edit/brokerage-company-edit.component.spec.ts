import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageCompanyEditComponent } from './brokerage-company-edit.component';

describe('BrokerageCompanyEditComponent', () => {
  let component: BrokerageCompanyEditComponent;
  let fixture: ComponentFixture<BrokerageCompanyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerageCompanyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerageCompanyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
