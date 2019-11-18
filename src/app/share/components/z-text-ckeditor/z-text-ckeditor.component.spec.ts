import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZTextCkeditorComponent } from './z-text-ckeditor.component';

describe('ZTextCkeditorComponent', () => {
  let component: ZTextCkeditorComponent;
  let fixture: ComponentFixture<ZTextCkeditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZTextCkeditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZTextCkeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
