import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushDetailComponent } from './push-detail.component';

describe('PushDetailComponent', () => {
  let component: PushDetailComponent;
  let fixture: ComponentFixture<PushDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
