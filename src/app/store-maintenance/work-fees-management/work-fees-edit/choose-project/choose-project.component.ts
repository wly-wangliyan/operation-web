import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import {
  ProjectManagemantHttpService,
  ProjectEntity
} from 'src/app/operational-system/maintenance/project-managemant/project-managemant-http.service';

@Component({
  selector: 'app-choose-project',
  templateUrl: './choose-project.component.html',
  styleUrls: ['./choose-project.component.css']
})
export class ChooseProjectComponent implements OnInit {

  @Input() private selectedCategory: number; // 已选中的项目类别

  @Input() private selectedProjectid: string; // 已选中的配件/服务Id

  public projectCategories = [1, 2]; // 项目类别 1:机油 2:机油滤清器

  public projectList: Array<ProjectEntity> = []; // 保养项目列表

  public currentProjectList: Array<ProjectEntity> = []; // 所选项目类别对应的保养项目列表

  public currentProject: ProjectEntity = new ProjectEntity(); // 所选配件/服务

  private requestSubscription: Subscription; // 分页获取数据

  public currentCategory: number;

  public tipMsg = ''; // 提示信息

  constructor(
    private globalService: GlobalService,
    private projectService: ProjectManagemantHttpService
  ) { }

  @Output('selectedProject') public selectedProject = new EventEmitter();

  public ngOnInit() {
  }

  /**
   * 打开
   */
  public open() {
    setTimeout(() => {
      this.initModal();
      $('#chooseProjectModal').modal();
      this.requestPrijectList();
    }, 0);
  }

  // 初始化
  private initModal() {
    this.tipMsg = '';
    this.currentCategory = null;
    this.projectList = [];
    this.currentProjectList = [];
    this.currentProject = new ProjectEntity();
    if (this.selectedCategory) {
      this.currentCategory = this.selectedCategory;
    }
  }

  /**
   * 关闭
   */
  public close() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    $('#selectProjectModal').modal('hide');
  }

  public onCategoryClick(category: number) {
    this.tipMsg = '';
    this.currentProjectList = [];
    this.currentProject = new ProjectEntity();
    this.currentCategory = category;
    if (this.projectList) {
      this.currentProjectList = this.projectList.filter(value => value.upkeep_item_category === category);
    }
  }

  // 选中项目
  public onProjectClick(project: ProjectEntity) {
    this.tipMsg = '';
    this.currentProject = project;
  }

  // 获取所有配件/服务
  private requestPrijectList() {
    this.projectList = [];
    this.requestSubscription = this.projectService.requestProjectListData().subscribe(res => {
      this.projectList = res;
      if (this.selectedCategory && this.selectedProjectid) {
        this.onCategoryClick(this.selectedCategory);
        if (this.currentProjectList.some(value => value.upkeep_item_id === this.selectedProjectid)) {
          const project = this.currentProjectList.filter(value => value.upkeep_item_id === this.selectedProjectid);
          this.currentProject = project[0];
        }
      }
    }, err => {
      $('#selectProjectModal').modal('hide');
      this.globalService.httpErrorProcess(err);
    });
  }

  // 回传选中事件
  public onSelectEmit() {
    if (this.currentProject && this.currentProject.upkeep_item_id) {
      this.selectedProject.emit(
        {
          category: this.currentCategory,
          project: this.currentProject
        });
      $('#selectProjectModal').modal('hide');
    } else {
      this.tipMsg = '请选择配件/服务';
    }
  }
}

