import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InterfaceDecorationComponent } from './interface-decoration.component';


describe('InterfaceDecorationComponent', () => {
  let component: InterfaceDecorationComponent;
  let fixture: ComponentFixture<InterfaceDecorationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfaceDecorationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceDecorationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
