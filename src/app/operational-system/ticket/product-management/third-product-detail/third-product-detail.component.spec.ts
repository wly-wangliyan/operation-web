import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdProductDetailComponent } from './third-product-detail.component';

describe('ThirdProductDetailComponent', () => {
  let component: ThirdProductDetailComponent;
  let fixture: ComponentFixture<ThirdProductDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirdProductDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
