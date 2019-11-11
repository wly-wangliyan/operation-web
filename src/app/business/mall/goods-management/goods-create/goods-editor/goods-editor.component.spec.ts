import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsEditorComponent } from './goods-editor.component';

describe('GoodsEditorComponent', () => {
  let component: GoodsEditorComponent;
  let fixture: ComponentFixture<GoodsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
