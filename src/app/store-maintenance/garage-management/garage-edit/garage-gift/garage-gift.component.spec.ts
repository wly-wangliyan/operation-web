import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageGiftComponent } from './garage-gift.component';

describe('GaragGiftComponent', () => {
  let component: GarageGiftComponent;
  let fixture: ComponentFixture<GarageGiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GarageGiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GarageGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
