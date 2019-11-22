import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseAccessoryComponent } from './choose-accessory.component';

describe('ChooseAccessoryComponent', () => {
  let component: ChooseAccessoryComponent;
  let fixture: ComponentFixture<ChooseAccessoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseAccessoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseAccessoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
