import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-txt-copy',
  templateUrl: './txt-copy.component.html',
  styleUrls: ['./txt-copy.component.css']
})
export class TxtCopyComponent {

  @Input() copyComplete = false;

}
