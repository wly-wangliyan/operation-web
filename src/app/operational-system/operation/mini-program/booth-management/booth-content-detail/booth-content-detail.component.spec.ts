import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothContentDetailComponent } from './booth-content-detail.component';

describe('BoothContentDetailComponent', () => {
  let component: BoothContentDetailComponent;
  let fixture: ComponentFixture<BoothContentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoothContentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoothContentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
