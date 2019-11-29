import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseBrandComponent } from './choose-brand.component';

describe('ChooseBrandComponent', () => {
  let component: ChooseBrandComponent;
  let fixture: ComponentFixture<ChooseBrandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseBrandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
