import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerConfigListComponent } from './banner-config-list.component';

describe('BannerConfigListComponent', () => {
  let component: BannerConfigListComponent;
  let fixture: ComponentFixture<BannerConfigListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerConfigListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
