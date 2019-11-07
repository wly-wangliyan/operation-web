import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZVideoSelectComponent } from './z-video-select.component';

describe('ZVideoSelectComponent', () => {
  let component: ZVideoSelectComponent;
  let fixture: ComponentFixture<ZVideoSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZVideoSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZVideoSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
