import { Component, OnInit, ViewChild } from '@angular/core';
import { ChooseProjectComponent } from './choose-project/choose-project.component';

@Component({
  selector: 'app-work-fees-edit',
  templateUrl: './work-fees-edit.component.html',
  styleUrls: ['./work-fees-edit.component.css']
})
export class WorkFeesEditComponent implements OnInit {

  @ViewChild('chooseProject', { static: true }) public chooseProject: ChooseProjectComponent;

  constructor() { }

  ngOnInit() {
  }

  // 打开所属项目选择组件
  public onOpenProjectModal(): void {
    this.chooseProject.open();
  }

}



