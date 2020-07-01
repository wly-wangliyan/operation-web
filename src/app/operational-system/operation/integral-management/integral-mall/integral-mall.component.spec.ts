import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegralMallComponent } from './integral-mall.component';

describe('IntegralMallComponent', () => {
  let component: IntegralMallComponent;
  let fixture: ComponentFixture<IntegralMallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegralMallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegralMallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
