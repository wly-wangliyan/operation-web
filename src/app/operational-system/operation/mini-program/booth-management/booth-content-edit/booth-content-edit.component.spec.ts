import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothContentEditComponent } from './booth-content-edit.component';

describe('BoothContentEditComponent', () => {
  let component: BoothContentEditComponent;
  let fixture: ComponentFixture<BoothContentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoothContentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoothContentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
