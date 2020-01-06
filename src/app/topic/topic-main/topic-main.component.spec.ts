import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicMainComponent } from './topic-main.component';

describe('TopicMainComponent', () => {
  let component: TopicMainComponent;
  let fixture: ComponentFixture<TopicMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
