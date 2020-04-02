import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerConfigEditComponent } from './banner-config-edit.component';

describe('BannerConfigEditComponent', () => {
  let component: BannerConfigEditComponent;
  let fixture: ComponentFixture<BannerConfigEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerConfigEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerConfigEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
