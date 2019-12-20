import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { GlobalService } from '../../../../core/global.service';
import {
  AccessoryLibraryService,
  ProjectEntity,
} from '../../accessory-library.service';

@Component({
  selector: 'app-choose-project',
  templateUrl: './choose-project.component.html',
  styleUrls: ['./choose-project.component.css']
})
export class ChooseProjectComponent implements OnInit {

  @Input() private selectedProjectid: string; // 已选中的项目Id

  public projectList: Array<ProjectEntity> = []; // 保养项目列表

  public currentProject: ProjectEntity = new ProjectEntity(); // 所选项目对象

  private requestSubscription: Subscription; // 分页获取数据

  public currentProjectId: string;

  public tipMsg = ''; // 提示信息

  private searchText$ = new Subject<any>();

  constructor(
    private globalService: GlobalService,
    private accessoryLibraryService: AccessoryLibraryService,
  ) { }

  @Output('selectedProject') public selectedProject = new EventEmitter();

  public ngOnInit() {
    // 项目列表
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.accessoryLibraryService.requestProjectListData())
    ).subscribe(res => {
      this.projectList = res.results;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  /**
   * 打开
   */
  public open() {
    this.initModal();
    const obj = new ProjectEntity();
    obj.project_id = '1';
    obj.project_name = '机油';
    this.projectList.push(obj);
    const obj1 = new ProjectEntity();
    obj1.project_id = '2';
    obj1.project_name = '机油滤清器';
    this.projectList.push(obj1);
    const obj2 = new ProjectEntity();
    obj2.project_id = '3';
    obj2.project_name = '蓄电池';
    this.projectList.push(obj2);
    console.log('1', this.projectList);
    // this.searchText$.next();
    setTimeout(() => {
      $('#chooseProjectModal').modal();
    }, 0);
  }

  // 初始化
  private initModal() {
    this.tipMsg = '';
    this.currentProjectId = '';
    this.projectList = [];
    if (this.selectedProjectid) {
      this.currentProjectId = this.selectedProjectid;
    }
  }

  /**
   * 关闭
   */
  public close() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    $('#chooseProjectModal').modal('hide');
  }

  // 选中项目
  public onProjectClick(project: ProjectEntity) {
    this.tipMsg = '';
    this.currentProject = project;
    this.currentProjectId = project.project_id;
  }

  // 回传选中事件
  public onSelectEmit() {
    if (this.currentProject && this.currentProject.project_id) {
      this.selectedProject.emit(
        {
          project: this.currentProject
        });
      $('#chooseProjectModal').modal('hide');
    } else {
      this.tipMsg = '请选择保养项目';
    }
  }
}

