import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothConfigEditComponent } from './booth-config-edit.component';

describe('BoothConfigEditComponent', () => {
  let component: BoothConfigEditComponent;
  let fixture: ComponentFixture<BoothConfigEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoothConfigEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoothConfigEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
