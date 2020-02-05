import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import { HttpErrorEntity } from '../../../core/http.service';
import { ParamEntity, ProjectEntity, ProjectManagementHttpService } from '../project-management-http.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {

  public currentProject: ProjectEntity = new ProjectEntity();
  public currentParam: ParamEntity = new ParamEntity();
  public paramList: Array<any> = [];
  public optionList: Array<any> = []; // 选项列表
  public errmsg: string;
  public isEdit: boolean;

  private continueRequestSubscription: Subscription;
  private sureCallback: any;
  private closeCallback: any;

  @Input() public sureName: string;

  @ViewChild('projectPromptDiv', { static: true }) public projectPromptDiv: ElementRef;
  @ViewChild('paramPromptDiv', { static: true }) public paramPromptDiv: ElementRef;
  @ViewChild('editParamPromptDiv', { static: true }) public editParamPromptDiv: ElementRef;

  constructor(private projectHttpService: ProjectManagementHttpService,
              private globalService: GlobalService) {
  }

  public ngOnInit(): void {
  }

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      this.onEditFormSubmit();
      return false;
    }
  }

  // 弹框close
  public onClose() {
    this.clear();
    this.currentProject = new ProjectEntity();
    $(this.projectPromptDiv.nativeElement).modal('hide');
  }

  // 编辑参数弹框close
  public onEditParamClose() {
    this.clear();
    this.optionList = [];
    $(this.editParamPromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开编辑保养项目确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public openProjectModal(project: ProjectEntity, sureFunc: any, sureName: string = '确定', closeFunc: any = null) {
    const openProjectModal = () => {
      timer(0).subscribe(() => {
        $(this.projectPromptDiv.nativeElement).modal('show');
      });
    };
    this.currentProject = project;
    this.sureName = sureName;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    openProjectModal();
  }

  /**
   * 打开参数列表模态框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public openParamModal(project: ProjectEntity, sureFunc: any, sureName: string = '确定', closeFunc: any = null) {
    const openParamModal = () => {
      timer(0).subscribe(() => {
        $(this.paramPromptDiv.nativeElement).modal('show');
      });
    };
    this.currentProject = project;
    this.paramList = project.param_list;
    this.sureName = sureName;
    openParamModal();
  }

  /**
   * 打开编辑参数模态框
   */
  public onEditParamClick(data: ParamEntity, isEdit: boolean) {
    this.currentParam = data;
    this.isEdit = isEdit;
    data.option.forEach(value => {
      this.optionList.push({option: value, time: new Date().getTime()});
    });
    if (data.option.length === 0) {
      this.optionList.push({time: new Date().getTime()});
    }
    $(this.editParamPromptDiv.nativeElement).modal('show');
  }

  // form提交
  public onEditFormSubmit() {
    this.clear();
    // 编辑参数选项
    this.currentParam.option = this.optionList.map(v => v.option);
    this.projectHttpService.requestEditParamData
    (this.currentProject.project_id, this.currentParam.param_id, this.currentParam.option).subscribe(() => {
      this.onClose();
      this.globalService.promptBox.open('保存成功！', () => {
        this.onEditParamClose();
      });
    }, err => {
      this.errorProcess(err);
    });
  }

  // 清空
  public clear() {
    this.errmsg = '';
  }

  // 确定按钮回调
  private sureCallbackInfo() {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.closeCallback = null;
      this.sureCallback = null;
      temp();
    }
  }

  // 接口错误状态
  private errorProcess(err) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.code === 'already_repeated' && content.resource === 'option') {
            this.errmsg = '选项中有重复！';
            return;
          }
        }
      }
    }
  }

  public onOptionChange(option: string, index: number) {
    const index1 = this.optionList.findIndex(value => value.option === option);
    if (index !== index1) {
      this.errmsg = '选项中有重复！';
    }
  }

  // 添加选项
  public onAddOptionClick() {
    this.errmsg = '';
    this.optionList.push({time: new Date().getTime()});
  }

  // 移除选项
  public onDelOptionClick(index: number) {
    this.errmsg = '';
    this.optionList.splice(index, 1);
  }
}
