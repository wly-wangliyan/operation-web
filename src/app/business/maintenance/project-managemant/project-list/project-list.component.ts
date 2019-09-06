import { Component, OnInit } from '@angular/core';
import { ProjectEntity } from '../project-managemant-http.service';
import { Subject } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { ProjectManagemantHttpService } from '../project-managemant-http.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  public projectCategories = [1, 2, 3]; // 项目类别 1:保养项目 2:清洗养护项目 3:维修项目

  public projectTypes = [1, 2]; // 项目类型 1:配件 2:服务

  public projectList: Array<ProjectEntity> = [];

  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();

  public projectParams: ProjectEntity = new ProjectEntity();

  public project_category = ''; // 项目类别

  public project_type = ''; // 项目类型

  public project_id = ''; // 配套项目id

  public projectErrMsg = ''; // 添加、编辑错误提示

  constructor(
    private globalService: GlobalService,
    private projectService: ProjectManagemantHttpService
  ) { }

  public ngOnInit() {
    this.generateProjectList();
  }

  // 初始化获取项目列表
  private generateProjectList() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestProjectList();
    });
    this.searchText$.next();
  }

  // 请求项目列表
  private requestProjectList() {
    this.projectService.requestProjectListData().subscribe(res => {
      this.projectList = res;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  /**
   * 获取配套项目
   * 前提是需要选择项目类别及项目类型
   */
  private requestProjectRecords() {
    if (this.project_category && this.project_type) {
      console.log('获取配套项目');
    } else {
      console.log('配套项目置空');
    }
  }

  /** 导入 */
  public onImportProject() {

  }

  /** 下载模板 */
  public onDownloadMould() {

  }

  /** 添加、编辑 */
  public onShowModal() {

  }

  /** 删除 */
  public onDeleteProgect() {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
      console.log('调用删除接口');
    });
  }

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      this.onEditFormSubmit();
      return false;
    }
  }

  // 确定事件
  public onEditFormSubmit() {

  }

  /** 校验项目新增参数是否合法 */
  private generateAndCheckParamsValid() {

  }

}
