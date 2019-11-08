import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZPreviewVideoPhotoComponent } from './z-preview-video-photo.component';

describe('ZPreviewVideoPhotoComponent', () => {
  let component: ZPreviewVideoPhotoComponent;
  let fixture: ComponentFixture<ZPreviewVideoPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZPreviewVideoPhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZPreviewVideoPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
