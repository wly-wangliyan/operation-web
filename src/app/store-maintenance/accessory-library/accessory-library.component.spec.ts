import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryLibraryComponent } from './accessory-library.component';

describe('AccessoryLibraryComponent', () => {
  let component: AccessoryLibraryComponent;
  let fixture: ComponentFixture<AccessoryLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessoryLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessoryLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
