import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionAddComponent } from './version-add.component';

describe('VersionAddComponent', () => {
  let component: VersionAddComponent;
  let fixture: ComponentFixture<VersionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
