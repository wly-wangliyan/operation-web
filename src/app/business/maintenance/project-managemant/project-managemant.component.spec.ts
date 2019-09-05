import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagemantComponent } from './project-managemant.component';

describe('ProjectManagemantComponent', () => {
  let component: ProjectManagemantComponent;
  let fixture: ComponentFixture<ProjectManagemantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectManagemantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectManagemantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
