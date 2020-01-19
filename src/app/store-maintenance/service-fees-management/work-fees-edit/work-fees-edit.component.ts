import { Component, OnInit, ViewChild } from '@angular/core';
import { ChooseProjectComponent } from './choose-project/choose-project.component';
import {
  WorkFeesManagementService,
  WorkFeesParams,
} from '../work-fees-management.service';

@Component({
  selector: 'app-work-fees-edit',
  templateUrl: './work-fees-edit.component.html',
  styleUrls: ['./work-fees-edit.component.css']
})
export class WorkFeesEditComponent implements OnInit {

  @ViewChild('chooseProject', { static: true }) public chooseProject: ChooseProjectComponent;

  public workFeesParams = new WorkFeesParams();

  constructor() { }

  ngOnInit() {
  }

  // 打开所属项目选择组件
  public onOpenProjectModal(): void {
    this.chooseProject.open();
  }

  // 选择所属项目回调函数
  public onSelectedProject(event: any): void {
    if (event) {
      this.workFeesParams.project_id = event.project.project_id;
      this.workFeesParams.project_name = event.project.project_name;
    }
  }

}



