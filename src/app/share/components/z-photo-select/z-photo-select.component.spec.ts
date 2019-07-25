import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZPhotoSelectComponent } from './z-photo-select.component';

describe('ZPhotoSelectComponent', () => {
  let component: ZPhotoSelectComponent;
  let fixture: ComponentFixture<ZPhotoSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZPhotoSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZPhotoSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
