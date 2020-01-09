import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashCarServiceEditComponent } from './wash-car-service-edit.component';

describe('WashCarServiceEditComponent', () => {
  let component: WashCarServiceEditComponent;
  let fixture: ComponentFixture<WashCarServiceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashCarServiceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashCarServiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
