import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { isUndefined } from 'util';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import { GlobalService } from '../../../../../core/global.service';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { differenceInCalendarDays } from 'date-fns';
import { PushManagementService, PushParams } from '../push-management.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  push_speed: ErrMessageItem = new ErrMessageItem();

  constructor(icon?: ErrMessageItem, offline_time?: ErrMessageItem, push_plan_rank?: ErrMessageItem, push_speed?: ErrMessageItem) {
    if (isUndefined(icon) || isUndefined(offline_time) || isUndefined(push_plan_rank) || isUndefined(push_speed)) {
      return;
    }
    this.icon = icon;
    this.offline_time = offline_time;
    this.push_plan_rank = push_plan_rank;
    this.push_speed = push_speed;
  }
}

@Component({
  selector: 'app-push-edit',
  templateUrl: './push-edit.component.html',
  styleUrls: ['./push-edit.component.css']
})
export class PushEditComponent implements OnInit {

  public pushParams: PushParams = new PushParams();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public cover_url = [];
  public coupon_service = ['停车服务', '检车服务', '保养服务', '票务服务', '预约服务'];
  public offline_status = null;
  public imgReg = /(jpg|jpeg|png|gif)$/; // 允许上传的图片格式
  public levelName = '新建';

  private push_id: string;

  private is_save = false; // 防止连续出发保存事件

  @Input() public data: any;
  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;

  constructor(
    private globalService: GlobalService,
    private pushService: PushManagementService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.paramMap.subscribe(map => {
      this.push_id = map.get('push_plan_id');
    });
  }

  public ngOnInit() {
    this.levelName = this.push_id ? '编辑' : '新建';
    if (this.push_id) {
      this.getPushDetail();
    } else {
      this.pushParams.url_type = '';
      this.pushParams.free_range_type = 1;
    }
  }

  // 获取详情
  private getPushDetail(): void {
    this.pushService.requestPushDetail(this.push_id).subscribe(data => {
      this.pushParams = new PushParams(data);
      if (data.end_time === 9999999999) {
        this.offline_status = 1;
      } else {
        this.offline_status = 2;
        this.pushParams.end_time = data.end_time * 1000;
      }
      this.pushParams.url_type = this.pushParams.url_type ? this.pushParams.url_type : '';
      this.pushParams.free_range_type = 1;
      this.cover_url = this.pushParams.push_image ? this.pushParams.push_image.split(',') : [];
    }, err => {
      if (err.status === 404) {
        this.globalService.promptBox.open('该条数据已删除，请刷新后重试！', null, 2000, null, false);
      } else {
        this.globalService.httpErrorProcess(err);
      }
    });
  }

  // 点击取消编辑、新建
  public onClose() {
    this.globalService.confirmationBox.open('提示', '是否确认取消编辑？', () => {
      this.globalService.confirmationBox.close();
      this.router.navigate(['/main/operation/mini-program/push-management/push-list'], { relativeTo: this.route });
    });
  }

  // 切换tab
  public onChangeTeb(type: string, status: number): void {
    switch (type) {
      case 'push_range':
        this.pushParams.range_type = null;
        this.pushParams.date_limit = null;
        this.pushParams.coupon_id = '';
        this.pushParams.coupon_group_id = '';
        this.pushParams.coupon_service = '';
        this.pushParams.push_range = status;
        this.pushParams.free_range_type = 1;
        this.pushParams.free_date_limit = null;
        break;
      case 'range_type':
        this.pushParams.coupon_id = '';
        this.pushParams.coupon_group_id = '';
        this.pushParams.date_limit = null;
        this.pushParams.coupon_service = '';
        this.pushParams.range_type = status;
        break;
      case 'push_speed_type':
        this.pushParams.push_interval = null;
        this.pushParams.push_num = null;
        this.pushParams.push_num_everyday = null;
        this.pushParams.push_speed_type = status;
        this.errPositionItem.push_speed.isError = false;
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

  public onChangeFreeRangeType(event: any): void {
    if (event.target.value) {
      this.pushParams.free_date_limit = null;
      this.pushParams.free_range_type = Number(event.target.value);
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
      const saveParams = this.pushParams.clone();
      if (this.offline_status === 1) {
        saveParams.end_time = 9999999999;
      } else {
        saveParams.end_time = new Date(this.pushParams.end_time).getTime() / 1000;
      }
      if (this.verification()) {
        if (!this.push_id) {
          // 添加推送
          this.pushService.requestAddPushData(saveParams).subscribe(() => {
            this.globalService.promptBox.open('添加成功！', () => {
              this.router.navigate(['../push_list'], { relativeTo: this.route });
            });
          }, err => {
            this.is_save = false;
            this.errorProcess(err);
          });
        } else {
          // 编辑推送
          this.pushService.requestUpdatePushData(this.push_id, saveParams).subscribe(() => {
            this.globalService.promptBox.open('修改成功！', () => {
              this.router.navigate(['../../push_list'], { relativeTo: this.route });
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

    if (Number(this.pushParams.push_num_everyday) > Number(this.pushParams.push_num)) {
      this.errPositionItem.push_speed.isError = true;
      this.errPositionItem.push_speed.errMes = '每日推送次数不能大于最大推送次数！';
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

  // 接口错误状态
  private errorProcess(err: any): any {
    if (!this.globalService.httpErrorProcess(err)) {
      if (this.push_id && err.status === 404) {
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
