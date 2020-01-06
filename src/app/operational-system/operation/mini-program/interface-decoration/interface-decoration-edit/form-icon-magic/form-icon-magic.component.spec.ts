import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIconMagicComponent } from './form-icon-magic.component';

describe('FormIconMagicComponent', () => {
  let component: FormIconMagicComponent;
  let fixture: ComponentFixture<FormIconMagicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormIconMagicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIconMagicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
