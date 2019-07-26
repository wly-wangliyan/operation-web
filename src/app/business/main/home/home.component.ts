import {Component} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {
  public color = '#2889e9';
  public colorPickerChangeFun() {
    console.log(this.color);
  }
}
