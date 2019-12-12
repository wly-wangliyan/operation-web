import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsWriteOffComponent } from './goods-write-off.component';

describe('GoodsWriteOffComponent', () => {
  let component: GoodsWriteOffComponent;
  let fixture: ComponentFixture<GoodsWriteOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsWriteOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsWriteOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
