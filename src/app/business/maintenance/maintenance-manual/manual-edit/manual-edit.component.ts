import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manual-edit',
  templateUrl: './manual-edit.component.html',
  styleUrls: ['./manual-edit.component.css']
})
export class ManualEditComponent implements OnInit {

  public isEdit = false; // 标记是否是编辑手册

  public title = '查看手册';

  constructor() { }

  public ngOnInit() {
  }

}
