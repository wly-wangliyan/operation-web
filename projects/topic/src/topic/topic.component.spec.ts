import { TestBed, async } from '@angular/core/testing';
import { TopicComponent } from './topic.component';

describe('TopicComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TopicComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TopicComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'topic'`, () => {
    const fixture = TestBed.createComponent(TopicComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('topic');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(TopicComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to topic!');
  });
});
