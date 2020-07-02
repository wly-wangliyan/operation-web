import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitConfigModalComponent } from './limit-config-modal.component';

describe('LimitConfigModalComponent', () => {
  let component: LimitConfigModalComponent;
  let fixture: ComponentFixture<LimitConfigModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitConfigModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitConfigModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
