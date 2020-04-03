import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothContentListComponent } from './booth-content-list.component';

describe('BoothContentListComponent', () => {
  let component: BoothContentListComponent;
  let fixture: ComponentFixture<BoothContentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoothContentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoothContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
