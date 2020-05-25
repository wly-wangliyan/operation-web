import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectWashCarShopComponent } from './expect-wash-car-shop.component';

describe('ExpectWashCarShopComponent', () => {
  let component: ExpectWashCarShopComponent;
  let fixture: ComponentFixture<ExpectWashCarShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectWashCarShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectWashCarShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
