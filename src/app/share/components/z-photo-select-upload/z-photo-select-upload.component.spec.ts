import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZPhotoSelectUploadComponent } from './z-photo-select-upload.component';

describe('ZPhotoSelectUploadComponent', () => {
  let component: ZPhotoSelectUploadComponent;
  let fixture: ComponentFixture<ZPhotoSelectUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZPhotoSelectUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZPhotoSelectUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
