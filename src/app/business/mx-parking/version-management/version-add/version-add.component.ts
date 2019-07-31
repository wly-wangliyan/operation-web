import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { AppAddComponent, ErrItem } from '../app-add/app-add.component';
import { GlobalService } from '../../../../core/global.service';
import { ErrPositionItem } from '../../first-page-icon/first-page-icon-edit/first-page-icon-edit.component';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { HttpErrorEntity } from '../../../../core/http.service';
import { ValidateHelper } from '../../../../../utils/validate-helper';
import { AddVersionParams, VersionManagementService } from '../version-management.service';

const PageSize = 15;

@Component({
  selector: 'app-version-add',
  templateUrl: './version-add.component.html',
  styleUrls: ['./version-add.component.css']
})
export class VersionAddComponent implements OnInit {
  public currentVersion: AddVersionParams = new AddVersionParams();
  public errPositionItem: ErrItem = new ErrItem();

  private application_id: string;
  private sureCallback: any;
  private closeCallback: any;

  @Input() public data: any;
  @Input() public sureName: string;

  @ViewChild('projectPromptDiv', { static: true }) public projectPromptDiv: ElementRef;
  @ViewChild('coverImg', {static: false}) public coverImgSelectComponent: ZPhotoSelectComponent;

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
    // this.clear();
    $(this.projectPromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(application_id: string, sureFunc: any, sureName: string = '确定', closeFunc: any = null) {
    const openProjectModal = (data?: any) => {
      timer(0).subscribe(() => {
        $(this.projectPromptDiv.nativeElement).modal('show');
      });
    };
    this.sureName = sureName;
    this.application_id = application_id;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.currentVersion = new AddVersionParams();
    openProjectModal();
    return;
  }

  // form提交
  public onEditFormSubmit() {
    this.clear();
    if (this.verification()) {
      // 添加Version
      this.versionManagementService.requestAddVersion(this.currentVersion, this.application_id).subscribe(() => {
        this.onClose();
        this.globalService.promptBox.open('保存成功！', () => {
          this.sureCallbackInfo();
          this.currentVersion = new AddVersionParams();
        });
      }, err => {
        this.errorProcess(err);

      });
    }
  }

  private verification() {
    let cisCheck = true;
    if (!ValidateHelper.CheckIsVersion(this.currentVersion.version)) {
      this.errPositionItem.version.isError = true;
      this.errPositionItem.version.errMes = '应用版本号输入格式错误，请重新输入！';
      cisCheck = false;
    }
    return cisCheck;
  }

  // 清空
  public clear() {
    this.errPositionItem.version.isError = false;
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
          if (content.code === 'invalid' && content.field === 'version') {
            this.errPositionItem.application_name.isError = true;
            this.errPositionItem.application_name.errMes = '应用版本号错误或无效！';
            return;
          }
        }
      }
    }
  }

  // 限制input[type='number']输入e
  public inputNumberLimit(event: any): boolean {
    const reg = /[\d]/;
    const keyCode = String.fromCharCode(event.keyCode);
    return (keyCode && reg.test(keyCode));
  }
}
