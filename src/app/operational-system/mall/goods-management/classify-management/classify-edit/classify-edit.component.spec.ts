import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassifyEditComponent } from './classify-edit.component';

describe('ClassifyEditComponent', () => {
  let component: ClassifyEditComponent;
  let fixture: ComponentFixture<ClassifyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassifyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
