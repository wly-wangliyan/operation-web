import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectEntity, ProjectParams, RelationParams } from '../project-managemant-http.service';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { ProjectManagemantHttpService } from '../project-managemant-http.service';
import { HttpErrorEntity } from '../../../../core/http.service';
import { FileImportViewModel } from '../../../../../utils/file-import.model';
import { ProgressModalComponent } from '../../../../share/components/progress-modal/progress-modal.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  public projectCategories = [1, 2, 3]; // 项目类别 1:保养项目 2:清洗养护项目 3:维修项目

  public projectTypes = [1, 2]; // 项目类型 1:配件 2:服务

  public projectList: Array<ProjectEntity> = []; // 保养项目列表

  public toRelationList: Array<ProjectEntity> = []; // 可关联项目列表

  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();

  public projectParams: ProjectParams = new ProjectParams();

  public project_category = ''; // 项目类别

  public project_type = ''; // 项目类型

  private project_id = ''; // 项目id

  public relation_id = ''; // 配套项目id

  public projectErrMsg = ''; // 添加、编辑错误提示

  public isCreateProject = true; // 标记是否为新建

  private relationParams: RelationParams = new RelationParams();

  public rowspan_1: number; // 保养项目合并行数量

  public rowspan_2: number; // 清洗养护项目合并行数量

  public rowspan_3: number; // 维修项目合并行数量

  private importSpotSubscription: Subscription; // 导入描述对象

  public importViewModel: FileImportViewModel = new FileImportViewModel();

  @ViewChild('progressModal', { static: true }) public progressModalComponent: ProgressModalComponent;

  constructor(
    private globalService: GlobalService,
    private projectService: ProjectManagemantHttpService
  ) { }

  public ngOnInit() {
    this.generateProjectList();
  }

  // 初始化获取项目列表
  private generateProjectList(): void {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestProjectList();
    });
    this.searchText$.next();
  }

  // 请求项目列表
  private requestProjectList(): void {
    this.projectService.requestProjectListData().subscribe(res => {
      this.projectList = res;

      // 合并单元格
      const category_1 = this.projectList.filter(value => value.upkeep_item_category === 1);
      const category_2 = this.projectList.filter(value => value.upkeep_item_category === 2);
      const category_3 = this.projectList.filter(value => value.upkeep_item_category === 3);
      this.projectList = category_1.concat(category_2, category_3);
      this.rowspan_1 = category_1.length;
      this.rowspan_2 = category_2.length;
      this.rowspan_3 = category_3.length;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 解订阅
  public onCloseUnsubscribe(): void {
    this.importSpotSubscription && this.importSpotSubscription.unsubscribe();
  }

  /**
   * 导入
   * 导入成功后需要刷新列表
   */
  public onImportProject(): void {
    $('#importProjectPromptDiv').modal('show');
    this.importViewModel.initImportData();
  }

  // 取消导入
  public onCancelData(): void {
    this.onCloseUnsubscribe();
    this.importViewModel.initImportData();
    $('#importProjectPromptDiv').modal('hide');
  }

  /* 导入数据 */
  public onSubmitImportProject(): void {
    if (this.importViewModel.address) {
      const length = this.importViewModel.address.length;
      const index = this.importViewModel.address.lastIndexOf('.');
      const type = this.importViewModel.address.substring(index, length);
      if (type !== '.xlsx' && type !== '.csv') {
        this.globalService.promptBox.open('文件格式错误！', null, 2000, null, false);
        return;
      }
    }
    if (this.importViewModel.checkFormDataValid()) {
      this.progressModalComponent.openOrClose(true);
      this.importSpotSubscription = this.projectService.requestImportProjectData(
        this.importViewModel.type, this.importViewModel.file).subscribe(res => {
          this.progressModalComponent.openOrClose(false);
          $('#dataImportModal').modal('hide');
          const date = JSON.parse(res.response);
          this.globalService.promptBox.open(`成功导入${date.success}条，失败${date.failed}条！`, () => {
            this.importViewModel.initImportData();
            $('#importProjectPromptDiv').modal('hide');
            this.searchText$.next();
          }, -1);
        }, err => {
          this.progressModalComponent.openOrClose(false);
          timer(300).subscribe(() => {
            if (!this.globalService.httpErrorProcess(err)) {
              if (err.status === 422) {
                const tempErr = JSON.parse(err.responseText);
                const error = tempErr.length > 0 ? tempErr[0].errors[0] : tempErr.errors[0];
                if (error.field === 'FILE' && error.code === 'invalid') {
                  this.globalService.promptBox.open('导入文件不能为空！', null, 2000, null, false);
                } else if (error.resource === 'FILE' && error.code === 'incorrect_format') {
                  this.globalService.promptBox.open('文件格式错误！', null, 2000, null, false);
                } else if (error.resource === 'FILE' && error.code === 'scale_out') {
                  this.globalService.promptBox.open('单次最大可导入200条，请重新上传！', null, 2000, null, false);
                } else if (error.resource === 'FILE' && error.code === 'upkeep_item_nums repeated') {
                  this.globalService.promptBox.open('存在重复的项目ID，请重新上传！', null, 2000, null, false);
                } else {
                  this.globalService.promptBox.open('导入失败，请重新上传！', null, 2000, null, false);
                }
              }
            }
          });
        });
    } else {
      this.globalService.promptBox.open('文件地址不能为空，请选择！', null, 2000, null, false);
    }
  }

  /** 添加、编辑 */
  public onShowModal(data?: ProjectEntity): void {
    this.onClearErrMsg();
    if (data) {
      this.isCreateProject = false;
      this.project_id = data.upkeep_item_id;
      this.projectParams = new ProjectParams();
      this.relation_id = data.upkeep_item_relation ? data.upkeep_item_relation.upkeep_item_id : '';
      this.projectParams.upkeep_item_relation = this.relation_id ? this.relation_id : null;
      this.projectParams.upkeep_item_category = data.upkeep_item_category;
      this.project_category = String(data.upkeep_item_category);
      this.requestRelationProjects(data.upkeep_item_category); // 获取可关联列表
      this.projectParams.upkeep_item_name = data.upkeep_item_name;
      this.projectParams.upkeep_item_type = data.upkeep_item_type;
      this.project_type = String(data.upkeep_item_type);
      this.projectParams.upkeep_item_content = data.upkeep_item_content;
      this.projectParams.upkeep_item_num = data.upkeep_item_num;
    } else {
      this.isCreateProject = true;
      this.project_category = '';
      this.project_type = '';
      this.relation_id = '';
      this.projectParams = new ProjectParams();
    }
  }

  public onClearErrMsg(): void {
    this.projectErrMsg = '';
  }

  /** 删除 */
  public onDeleteProgect(): void {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
    });
  }

  // 变更项目类别后，获取同大类下可关联项目列表
  public onChangeCategory(event: any): void {
    this.toRelationList = [];
    this.relation_id = '';
    this.projectParams.upkeep_item_relation = null;
    this.onClearErrMsg();
    const category_id = event.target.value;
    if (category_id) {
      this.projectParams.upkeep_item_category = Number(category_id);
      this.requestRelationProjects(category_id);
    } else {
      this.projectParams.upkeep_item_category = null;
    }
  }

  // 获取可用配套项目
  private requestRelationProjects(category_id: any): void {
    if (category_id) {
      this.relationParams.upkeep_item_category = category_id;
      this.relationParams.upkeep_item_id = this.project_id;
      this.projectService.requestRelationProjectsData(this.relationParams).subscribe(data => {
        this.toRelationList = data;
        if (this.projectParams.upkeep_item_relation) {
          if (!this.toRelationList.some(value => value.upkeep_item_id === this.projectParams.upkeep_item_relation)) {
            this.relation_id = '';
            this.projectParams.upkeep_item_relation = null;
          }
        }
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 变更项目类型
  public onChangeType(event: any): void {
    this.onClearErrMsg();
    const type_id = event.target.value;
    if (type_id) {
      this.projectParams.upkeep_item_type = Number(type_id);
    } else {
      this.projectParams.upkeep_item_type = null;
    }
  }

  // 变更配套项目处理
  public onChangeRelation(event: any): void {
    if (event.target.value) {
      this.projectParams.upkeep_item_relation = event.target.value;
    } else {
      this.projectParams.upkeep_item_relation = null;
    }
  }

  // 确定事件
  public onEditFormSubmit(): void {
    if (this.generateAndCheckParamsValid()) {
      if (this.isCreateProject) {
        this.requestAddProject();
      } else {
        this.requestUpdateProject();
      }
    }
  }

  // 添加
  private requestAddProject(): void {
    this.projectService.requestAddProjectData(this.projectParams).subscribe(res => {
      $('#editProjectModal').modal('hide');
      this.globalService.promptBox.open('保存成功！');
      this.searchText$.next();
    }, err => {
      this.errorProcess(err);
    });
  }

  // 编辑
  private requestUpdateProject(): void {
    this.projectService.requestUpdateProjectData(this.project_id, this.projectParams).subscribe(res => {
      $('#editProjectModal').modal('hide');
      this.globalService.promptBox.open('保存成功！');
      this.searchText$.next();
    }, err => {
      this.errorProcess(err);
    });
  }

  /** 校验项目新增参数是否合法 */
  private generateAndCheckParamsValid(): boolean {
    if (!this.projectParams.upkeep_item_category) {
      this.projectErrMsg = '请选择项目类别！';
      return false;
    }

    if (!this.projectParams.upkeep_item_type) {
      this.projectErrMsg = '请选择项目类型！';
      return false;
    }

    if (!this.projectParams.upkeep_item_name) {
      this.projectErrMsg = '请输入名称！';
      return false;
    }

    if (!this.projectParams.upkeep_item_num) {
      this.projectErrMsg = '请输入项目ID！';
      return false;
    } else {
      const first_num = this.projectParams.upkeep_item_num.slice(0, 1);
      if (first_num !== this.project_category) {
        this.projectErrMsg = '项目ID请以' + this.project_category + '开头';
        return false;
      }
    }
    return true;
  }

  // 接口错误信息处理
  private errorProcess(err: any): void {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.resource === 'upkeep_item_relation' && content.code === 'invalid') {
            this.projectErrMsg = '所选配套项目不存在！';
            return;
          } else if (content.resource === 'upkeep_item_num' && content.code === 'already_exits') {
            this.projectErrMsg = '项目ID已存在！';
            return;
          } else if (content.field === 'upkeep_item_name' && content.code === 'invalid') {
            this.projectErrMsg = '数据错误，保存失败！';
            return;
          } else {
            this.projectErrMsg = '参数错误或无效！';
            return;
          }
        }
      }
    }
  }
}
