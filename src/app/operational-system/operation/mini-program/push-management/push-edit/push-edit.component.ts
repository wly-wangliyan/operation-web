import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { isUndefined } from 'util';
import { Subscription, timer } from 'rxjs';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import { GlobalService } from '../../../../../core/global.service';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { differenceInCalendarDays } from 'date-fns';
import { PushManagementService, PushParams } from '../push-management.service';

export class ErrMessageItem {
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

export class ErrPositionItem {
  icon: ErrMessageItem = new ErrMessageItem();
  offline_time: ErrMessageItem = new ErrMessageItem();
  push_plan_rank: ErrMessageItem = new ErrMessageItem();

  constructor(icon?: ErrMessageItem, offline_time?: ErrMessageItem, push_plan_rank?: ErrMessageItem) {
    if (isUndefined(icon) || isUndefined(offline_time) || isUndefined(push_plan_rank)) {
      return;
    }
    this.icon = icon;
    this.offline_time = offline_time;
    this.push_plan_rank = push_plan_rank;
  }
}

@Component({
  selector: 'app-push-edit',
  templateUrl: './push-edit.component.html',
  styleUrls: ['./push-edit.component.css']
})
export class PushEditComponent implements OnInit {

  public isCreatePush = true;
  public pushParams: PushParams = new PushParams();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public cover_url = [];
  public coupon_service = ['请选择', '停车服务', '检车服务', '保养服务', '票务服务', '预约服务'];
  public offline_status = null;
  public imgReg = /(jpg|jpeg|png|gif)$/; // 允许上传的图片格式

  private sureCallback: any;
  private closeCallback: any;
  private requestSubscription: Subscription;
  private push_id: string;

  private is_save = false; // 防止连续出发保存事件

  @Input() public data: any;
  @Input() public sureName = '保存';
  @ViewChild('pushPromptDiv', { static: false }) public pushPromptDiv: ElementRef;
  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;

  constructor(private globalService: GlobalService, private pushService: PushManagementService) { }

  public ngOnInit() {
  }

  // 弹框close
  public onClose() {
    this.clear();
    $('.form-horizontal').scrollTop(0);
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.pushParams = new PushParams();
    $(this.pushPromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(data: any, sureFunc: any, closeFunc: any = null) {
    const openPushModal = () => {
      timer(0).subscribe(() => {
        $(this.pushPromptDiv.nativeElement).modal('show');
      });
    };
    this.isCreatePush = data && data.push_plan_id ? false : true;
    this.push_id = data ? data.push_plan_id : '';
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.clear();
    this.is_save = false;
    if (this.isCreatePush) {
      this.pushParams = new PushParams();
      this.cover_url = [];
      this.offline_status = null;
      this.pushParams.url_type = 0;
    } else {
      this.showEditData(data);
    }
    openPushModal();
  }

  private showEditData(data: any) {
    this.pushParams = new PushParams(data);
    if (data.end_time === 9999999999) {
      this.offline_status = 1;
    } else {
      this.offline_status = 2;
      this.pushParams.end_time = data.end_time * 1000;
    }
    this.pushParams.url_type = this.pushParams.url_type ? this.pushParams.url_type : 0;
    this.cover_url = this.pushParams.push_image ? this.pushParams.push_image.split(',') : [];
  }

  // 切换tab
  public onChangeTeb(type: string, status: number): void {
    switch (type) {
      case 'push_range':
        this.pushParams.range_type = null;
        this.pushParams.date_limit = null;
        this.pushParams.coupon_id = '';
        this.pushParams.coupon_group_id = '';
        this.pushParams.coupon_service = 0;
        this.pushParams.push_range = status;
        break;
      case 'range_type':
        this.pushParams.coupon_id = '';
        this.pushParams.coupon_group_id = '';
        this.pushParams.date_limit = null;
        this.pushParams.coupon_service = 0;
        this.pushParams.range_type = status;
        break;
      case 'push_speed_type':
        this.pushParams.push_interval = null;
        this.pushParams.push_num = null;
        this.pushParams.push_speed_type = status;
        break;
      case 'push_type':
        this.pushParams.push_type = status;
        break;
      case 'offline_status':
        this.pushParams.end_time = null;
        this.offline_status = status;
        this.errPositionItem.offline_time.isError = false;
        this.errPositionItem.offline_time.errMes = '';
        break;
    }
  }

  // form提交
  public onEditFormSubmit(): void {
    if (this.is_save) {
      return;
    }
    this.clear();
    this.is_save = true;
    this.coverImgSelectComponent.upload().subscribe(() => {
      const imageUrl = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl);
      this.pushParams.push_image = imageUrl.join(',');
      if (this.offline_status === 1) {
        this.pushParams.end_time = 9999999999;
      }
      const saveParams = this.pushParams.clone();
      saveParams.coupon_service = this.pushParams.coupon_service === 0 ? null : this.pushParams.coupon_service;
      saveParams.url_type = Number(this.pushParams.url_type) === 0 ? null : Number(this.pushParams.url_type);
      if (this.verification()) {
        if (this.isCreatePush) {
          // 添加推送
          this.pushService.requestAddPushData(saveParams).subscribe(() => {
            this.onClose();
            this.globalService.promptBox.open('添加成功！', () => {
              this.sureCallbackInfo();
            });
          }, err => {
            this.is_save = false;
            this.errorProcess(err);
          });
        } else {
          // 编辑推送
          this.pushService.requestUpdatePushData(this.push_id, saveParams).subscribe(() => {
            this.onClose();
            this.globalService.promptBox.open('修改成功！', () => {
              this.sureCallbackInfo();
            });
          }, err => {
            this.is_save = false;
            this.errorProcess(err);
          });
        }
      } else {
        this.is_save = false;
      }
    }, err => {
      this.is_save = false;
      this.upLoadErrMsg(err);
    });
  }

  // 表单提交校验
  private verification(): boolean {
    let cisCheck = true;
    if (!this.pushParams.push_image) {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '请重新上传图片！';
      cisCheck = false;
    }

    if (this.offline_status === 2) {
      if (!this.pushParams.end_time) {
        this.errPositionItem.offline_time.isError = true;
        this.errPositionItem.offline_time.errMes = '请选择下线时间！';
        cisCheck = false;
      } else {
        const offlineTimestamp = new Date(this.pushParams.end_time).setHours(new Date(this.pushParams.end_time).getHours(),
            new Date(this.pushParams.end_time).getMinutes(), 0, 0) / 1000;
        const currentTimeStamp = new Date().getTime() / 1000;
        if (offlineTimestamp - currentTimeStamp <= 0) {
          this.errPositionItem.offline_time.isError = true;
          this.errPositionItem.offline_time.errMes = '下线时间应大于当前时间！';
          cisCheck = false;
        } else {
          this.pushParams.end_time = offlineTimestamp;
        }
      }
    }
    return cisCheck;
  }

  // 清空
  public clear(): void {
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.offline_time.isError = false;
    this.errPositionItem.push_plan_rank.isError = false;
  }

  // 确定按钮回调
  private sureCallbackInfo(): any {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.closeCallback = null;
      this.sureCallback = null;
      temp();
    }
  }

  // 接口错误状态
  private errorProcess(err: any): any {
    if (!this.globalService.httpErrorProcess(err)) {
      if (!this.isCreatePush && err.status === 404) {
        this.globalService.promptBox.open('该条数据已删除，请刷新后重试!', null, 2000, null, false);
      } else if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.resource === 'push_plan_rank' && content.code === 'existed_rank') {
            this.errPositionItem.push_plan_rank.isError = true;
            this.errPositionItem.push_plan_rank.errMes = '此优先级重复，请重新设置！';
            return;
          }
        }
      }
    }
  }

  // 上传图片错误信息处理
  private upLoadErrMsg(err: any) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        this.errPositionItem.icon.isError = true;
        this.errPositionItem.icon.errMes = '参数错误，可能文件格式错误！';
      } else if (err.status === 413) {
        this.errPositionItem.icon.isError = true;
        this.errPositionItem.icon.errMes = '上传资源文件太大，服务器无法保存！';
      } else {
        this.errPositionItem.icon.isError = true;
        this.errPositionItem.icon.errMes = '上传失败，请重试！';
      }
    }
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event: any): any {
    this.errPositionItem.icon.isError = false;
    if (event === 'type_error') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '图片大小不得高于2M！';
    }
  }

  // 下线时间的禁用部分
  public disabledTime = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) < 0) {
      return true;
    } else {
      return false;
    }
  }
}
