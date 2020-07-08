import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityEditComponent } from './commodity-edit.component';

describe('CommodityEditComponent', () => {
  let component: CommodityEditComponent;
  let fixture: ComponentFixture<CommodityEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommodityEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommodityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
