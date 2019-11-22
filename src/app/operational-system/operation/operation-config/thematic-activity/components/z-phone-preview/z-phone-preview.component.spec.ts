import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZPhonePreviewComponent } from './z-phone-preview.component';

describe('ZPhonePreviewComponent', () => {
  let component: ZPhonePreviewComponent;
  let fixture: ComponentFixture<ZPhonePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZPhonePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZPhonePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
