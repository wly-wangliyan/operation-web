import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxtCopyComponent } from './txt-copy.component';

describe('TxtCopyComponent', () => {
  let component: TxtCopyComponent;
  let fixture: ComponentFixture<TxtCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TxtCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxtCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
