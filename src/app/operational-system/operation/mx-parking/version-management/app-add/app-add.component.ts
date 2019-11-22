import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import { GlobalService } from '../../../../../core/global.service';
import { isUndefined } from 'util';
import { AddApplicationParams, VersionManagementService } from '../version-management.service';
import { ValidateHelper } from '../../../../../../utils/validate-helper';
import { HttpErrorEntity } from '../../../../../core/http.service';

export class ErrMsgItem {
  public isError = false;
  public errMes: string;

  constructor(isError?: boolean, errMes?: string) {
    if (!isError || isUndefined(errMes)) {
      return;
    }
    this.isError = isError;
    this.errMes = errMes;
  }
}

export class ErrItem {
  version: ErrMsgItem = new ErrMsgItem();
  application_name: ErrMsgItem = new ErrMsgItem();
  system: ErrMsgItem = new ErrMsgItem();
  bundle_id: ErrMsgItem = new ErrMsgItem();

  constructor(version?: ErrMsgItem, application_name?: ErrMsgItem, system?: ErrMsgItem, bundle_id?: ErrMsgItem) {
    if (isUndefined(version) || isUndefined(application_name) || isUndefined(system) || isUndefined(bundle_id)) {
      return;
    }
    this.version = version;
    this.application_name = application_name;
    this.system = system;
    this.bundle_id = bundle_id;
  }
}

@Component({
  selector: 'app-app-add',
  templateUrl: './app-add.component.html',
  styleUrls: ['./app-add.component.css']
})
export class AppAddComponent implements OnInit {
  public currentApp: AddApplicationParams = new AddApplicationParams();
  public errPositionItem: ErrItem = new ErrItem();

  private sureCallback: any;
  private closeCallback: any;

  @Input() public data: any;
  @Input() public sureName: string;

  @ViewChild('projectPromptDiv', { static: true }) public projectPromptDiv: ElementRef;
  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;

  constructor(private versionManagementService: VersionManagementService,
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
    $(this.projectPromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(sureFunc: any, sureName: string = '确定', closeFunc: any = null) {
    const openProjectModal = (data?: any) => {
      timer(0).subscribe(() => {
        $(this.projectPromptDiv.nativeElement).modal('show');
      });
    };
    this.sureName = sureName;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.currentApp = new AddApplicationParams();
    openProjectModal();
    return;
  }

  // form提交
  public onEditFormSubmit() {
    this.clear();
    if (this.verification()) {
      // 添加Application
      this.versionManagementService.requestAddApplication(this.currentApp).subscribe(() => {
        this.onClose();
        this.globalService.promptBox.open('保存成功！', () => {
          this.sureCallbackInfo();
          this.currentApp = new AddApplicationParams();
        });
      }, err => {
        this.errorProcess(err);

      });
    }
  }

  // 格式校验
  private verification() {
    let cisCheck = true;
    if (!ValidateHelper.CheckIsBundleID(this.currentApp.bundle_id)) {
      this.errPositionItem.bundle_id.isError = true;
      this.errPositionItem.bundle_id.errMes = 'Bundle ID输入错误，请重新输入！';
      cisCheck = false;
    }
    return cisCheck;
  }

  // 清空
  public clear() {
    this.errPositionItem.system.isError = false;
    this.errPositionItem.application_name.isError = false;
    this.errPositionItem.bundle_id.isError = false;
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
          if (content.code === 'invalid' && content.field === 'application_name') {
            this.errPositionItem.application_name.isError = true;
            this.errPositionItem.application_name.errMes = '应用名称错误或无效！';
            return;
          }
        }
      }
    }
  }
}
