import { Component, OnInit } from '@angular/core';
import { NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../core/global.service';
import { PushService } from '../../push/push.service';

@Component({
  selector: 'app-function-authorize-list',
  templateUrl: './function-authorize-list.component.html',
  styleUrls: ['./function-authorize-list.component.css']
})
export class FunctionAuthorizeListComponent implements OnInit {

  constructor() {
  }

  public ngOnInit() { }
}
