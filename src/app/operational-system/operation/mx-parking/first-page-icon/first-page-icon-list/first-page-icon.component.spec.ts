import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPageIconComponent } from './first-page-icon.component';

describe('FirstPageIconComponent', () => {
  let component: FirstPageIconComponent;
  let fixture: ComponentFixture<FirstPageIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstPageIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstPageIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
