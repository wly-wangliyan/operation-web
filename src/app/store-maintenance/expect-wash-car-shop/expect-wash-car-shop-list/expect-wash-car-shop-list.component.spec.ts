import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectWashCarShopListComponent } from './expect-wash-car-shop-list.component';

describe('ExpectWashCarShopListComponent', () => {
  let component: ExpectWashCarShopListComponent;
  let fixture: ComponentFixture<ExpectWashCarShopListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectWashCarShopListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectWashCarShopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
