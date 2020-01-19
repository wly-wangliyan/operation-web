import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { GlobalService } from '../../../../core/global.service';
import {
  AccessoryLibraryService,
  ProjectEntity,
} from '../../accessory-library.service';
@Component({
  selector: 'app-choose-brand',
  templateUrl: './choose-brand.component.html',
  styleUrls: ['./choose-brand.component.css']
})
export class ChooseBrandComponent implements OnInit {

  @Input() private selectedCategory: string; // 已选中的项目类别

  @Input() private selectedBrandid: string; // 已选中的品牌Id

  public brandList: Array<ProjectEntity> = []; // 项目列表

  public currentbrandList: Array<ProjectEntity> = []; // 所选项目类别对应的保养项目列表

  public currentProject: ProjectEntity = new ProjectEntity(); // 所选配件/服务

  private requestSubscription: Subscription; // 分页获取数据

  public currentCategory: string;

  public tipMsg = ''; // 提示信息

  public currentBrandId: string;

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
      this.brandList = res.results;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  /**
   * 打开
   */
  public open() {
    const obj = new ProjectEntity();
    obj.project_id = '1';
    obj.project_name = '风帆';
    this.brandList.push(obj);
    const obj1 = new ProjectEntity();
    obj1.project_id = '2';
    obj1.project_name = '美孚';
    this.brandList.push(obj1);
    const obj2 = new ProjectEntity();
    setTimeout(() => {
      this.initModal();
      $('#chooseBrandModal').modal();
    }, 0);
  }

  // 初始化
  private initModal() {
    this.tipMsg = '';
    this.currentBrandId = '';
    this.brandList = [];
    if (this.selectedBrandid) {
      this.currentBrandId = this.selectedBrandid;
    }
  }

  /**
   * 关闭
   */
  public close() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    $('#chooseBrandModal').modal('hide');
  }

  public onCategoryClick(category: string) {
    this.tipMsg = '';
    this.currentbrandList = [];
    this.currentProject = new ProjectEntity();
    this.currentCategory = category;
    if (this.brandList) {
      this.currentbrandList = this.brandList.filter(value => value.project_id === category);
    }
  }

  // 选中项目
  public onProjectClick(project: ProjectEntity) {
    this.tipMsg = '';
    this.currentProject = project;
  }

  // 回传选中事件
  public onSelectEmit() {
    if (this.currentProject && this.currentProject.project_id) {
      this.selectedProject.emit(
        {
          category: this.currentCategory,
          project: this.currentProject
        });
      $('#chooseBrandModal').modal('hide');
    } else {
      this.tipMsg = '请选择配件/服务';
    }
  }
}


