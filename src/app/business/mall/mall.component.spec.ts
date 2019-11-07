import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MallComponent } from './mall.component';

describe('MallComponent', () => {
  let component: MallComponent;
  let fixture: ComponentFixture<MallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
