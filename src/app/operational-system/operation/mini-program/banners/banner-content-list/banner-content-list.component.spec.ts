import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerContentListComponent } from './banner-content-list.component';

describe('BannerContentListComponent', () => {
  let component: BannerContentListComponent;
  let fixture: ComponentFixture<BannerContentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerContentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
