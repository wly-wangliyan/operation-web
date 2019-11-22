import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThematicActivityComponent } from './thematic-activity.component';

describe('ThematicActivityComponent', () => {
  let component: ThematicActivityComponent;
  let fixture: ComponentFixture<ThematicActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThematicActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThematicActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
