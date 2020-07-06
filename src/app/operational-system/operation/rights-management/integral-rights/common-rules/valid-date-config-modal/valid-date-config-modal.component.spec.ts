import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidDateConfigModalComponent } from './valid-date-config-modal.component';

describe('ValidDateConfigModalComponent', () => {
  let component: ValidDateConfigModalComponent;
  let fixture: ComponentFixture<ValidDateConfigModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidDateConfigModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidDateConfigModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
