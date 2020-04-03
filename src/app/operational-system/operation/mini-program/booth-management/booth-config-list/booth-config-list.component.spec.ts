import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothConfigListComponent } from './booth-config-list.component';

describe('BoothConfigListComponent', () => {
  let component: BoothConfigListComponent;
  let fixture: ComponentFixture<BoothConfigListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoothConfigListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoothConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
