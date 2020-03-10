import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import { HttpErrorEntity } from '../../../core/http.service';
import {
  WashCarServiceConfigService,
  WashCarSpecificationEntity,
  WashCarActivityEntity,
  EditWashCarActivityParams
} from '../wash-car-service-config.service';
import { DisabledTimeHelper } from '../../../../utils/disabled-time-helper';
import { DateFormatHelper, TimeItem } from '../../../../utils/date-format-helper';

class RemoveItem {
  wash_car_activity_id: string;
  is_deleted: boolean;
}

@Component({
  selector: 'app-wash-car-activity-edit',
  templateUrl: './wash-car-activity-edit.component.html',
  styleUrls: ['./wash-car-activity-edit.component.css']
})

export class WashCarActivityEditComponent implements OnInit {
  public washCarActivityList: Array<WashCarActivityEntity> = []; // 活动列表
  public period_types = [1, 2, 3, 4]; // 活动时间
  public chnNumChar = ['一', '二', '三', '四', '五'];
  public week_day = [1, 2, 3, 4, 5, 6, 7];
  public activityErrMsg = ''; // 错误信息
  public isCreateActivity = true; // 标记创建或编辑
  public specification_name: string; // 规格名称
  private specificationData: WashCarSpecificationEntity; // 洗车规格信息
  private selectedActivity: WashCarActivityEntity = new WashCarActivityEntity(); // 当前操作活动
  private removeList: Array<RemoveItem> = []; // 移除的已有活动
  private editActivityParams: EditWashCarActivityParams = new EditWashCarActivityParams();
  private identifier = 0; // 防重复标记
  private requestSubscription: Subscription;
  private sureCallback: any;
  private closeCallback: any;
  private is_save = false; // 防止连续出发保存事件
  private wash_car_specification_id: string; // 洗车规格ID
  @ViewChild('washCarPromptDiv', { static: false }) public washCarPromptDiv: ElementRef;
  constructor(
    private globalService: GlobalService,
    private washCarService: WashCarServiceConfigService) { }

  ngOnInit() {
  }

  // 弹框close
  public onClose() {
    this.clear();
    this.requestSubscription && this.requestSubscription.unsubscribe();
    $(this.washCarPromptDiv.nativeElement).modal('hide');
  }

  private openWashCarActivityModal(): void {
    timer(0).subscribe(() => {
      $(this.washCarPromptDiv.nativeElement).modal('show');
    });
  }

  /**
   * 打开确认框
   * @param wash_car_specification_id 洗车规格ID
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(data: WashCarSpecificationEntity, sureFunc: any, closeFunc: any = null) {
    this.selectedActivity.valid_date_start = '';
    this.selectedActivity.valid_date_end = '';
    this.specificationData = data;
    this.wash_car_specification_id = data.wash_car_specification_id;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.clear();
    this.is_save = false;
    this.removeList = [];
    this.washCarActivityList = [];
    this.requestWashCarActivities();
  }

  // 获取洗车活动
  private requestWashCarActivities(): void {
    this.washCarService.requestWashCarActivitiesData(this.wash_car_specification_id).subscribe(res => {
      this.washCarActivityList = res;
      this.washCarActivityList.forEach(item => {
        this.identifier++;
        item.identifier = this.identifier;
        item.activity_fee = Number((item.activity_fee / 100).toFixed(2));
        if (item.period_type !== 4) {
          item.valid_time_start = item.valid_time_start ? DateFormatHelper.getMinuteOrTime(item.valid_time_start)
            : new TimeItem();
          item.valid_time_end = item.valid_time_end ? DateFormatHelper.getMinuteOrTime(item.valid_time_end)
            : new TimeItem();
        } else {
          item.valid_date_start = item.valid_date_start * 1000;
          item.valid_date_end = item.valid_date_end * 1000;
        }
      });
      this.isCreateActivity = !(this.washCarActivityList && this.washCarActivityList.length > 0);
      this.openWashCarActivityModal();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        this.globalService.promptBox.open('洗车活动数据获取失败,请刷新重试', null, -1, null, false);
      }
    });
  }

  public onChangeWeekDay(event: any, data: WashCarActivityEntity): void {
    if (event.target.value) {
      data.week_day = Number(event.target.value);
    }
  }

  // 增加活动
  public onAddActivityClick(): void {
    this.identifier++;
    this.clear();
    const item = new WashCarActivityEntity();
    item.valid_time_start = new TimeItem();
    item.valid_time_end = new TimeItem();
    item.identifier = this.identifier;
    this.washCarActivityList.push(item);
  }

  // 移除活动
  public onDeleteActivityClick(data: WashCarActivityEntity, index: number): void {
    this.clear();
    const wash_car_activity_id = data.wash_car_activity_id;
    if (wash_car_activity_id) {
      const removeItem = new RemoveItem();
      removeItem.wash_car_activity_id = wash_car_activity_id;
      removeItem.is_deleted = true;
      this.removeList.push(removeItem);
    }
    this.washCarActivityList.splice(index, 1);
  }

  // 切换活动时间类型并清空数据
  public onChangePeriodTypeClick(data: WashCarActivityEntity, event: any): void {
    this.clear();
    if (event) {
      data.period_type = Number(event);
    }
    data.week_day = '';
    data.month_day = null;
    data.valid_time_start = new TimeItem();
    data.valid_time_end = new TimeItem();
    data.valid_date_start = '';
    data.valid_date_end = '';
    data.activity_fee = null;
    data.activity_num = null;
  }

  // form提交
  public onEditFormSubmit(): void {
    if (this.is_save) {
      return;
    }
    this.clear();
    if (this.verification()) {
      this.is_save = true;
      if (this.isCreateActivity) {
        this.requestAddActivity();
      } else {
        this.requestEditActivity();
      }
    } else {
      this.is_save = false;
    }
  }

  // 新建活动
  private requestAddActivity(): void {
    this.washCarService.requestAddWashCarActivityData(this.wash_car_specification_id, this.editActivityParams)
      .subscribe(res => {
        this.onClose();
        this.globalService.promptBox.open('新建成功！', () => {
          this.sureCallbackInfo();
        });
      }, err => {
        this.is_save = false;
      });
  }
  // 编辑活动
  private requestEditActivity(): void {
    this.washCarService.requestEditWashCarActivityData(this.wash_car_specification_id, this.editActivityParams)
      .subscribe(res => {
        this.onClose();
        this.globalService.promptBox.open('编辑成功！', () => {
          this.sureCallbackInfo();
        });
      }, err => {
        this.is_save = false;
      });
  }

  // 表单提交校验
  private verification(): boolean {
    const tempActivityList = [];
    this.editActivityParams.wash_car_activities = [];
    for (const key in this.washCarActivityList) {
      if (this.washCarActivityList.hasOwnProperty(key)) {
        const activity = this.washCarActivityList[key].clone();
        const index = Number(key);
        if (activity.period_type === 4) {
          if (!activity.valid_date_start) {
            this.activityErrMsg = `活动${this.chnNumChar[index]}：请选择活动开始时间！`;
            return false;
          }
          if (!activity.valid_date_end) {
            this.activityErrMsg = `活动${this.chnNumChar[index]}：请选择活动结束时间！`;
            return false;
          }
          if (activity.valid_date_start && activity.valid_date_end) {
            const sTimestamp = new Date(activity.valid_date_start).getTime() / 1000;
            const eTimestamp = new Date(activity.valid_date_end).getTime() / 1000;
            const currentTimeStamp = new Date().getTime() / 1000;

            if (sTimestamp - eTimestamp >= 0) {
              this.activityErrMsg = `活动${this.chnNumChar[index]}：活动开始时间应小于活动结束时间！`;
              return false;
            }

            // 添加时，活动开始时间应大于等于当前时间; 编辑时，活动结束时间应大于等于当前时间
            if (this.isCreateActivity) {
              if (sTimestamp - currentTimeStamp < 0) {
                this.activityErrMsg = `活动${this.chnNumChar[index]}：活动开始时间不得小于当前时间`;
                return false;
              }
            } else {
              if (eTimestamp - currentTimeStamp < 0) {
                this.activityErrMsg = `活动${this.chnNumChar[index]}：活动结束时间不得小于当前时间`;
                return false;
              }
            }
            activity.valid_date_start = sTimestamp;
            activity.valid_date_end = eTimestamp;
          }
          activity.valid_time_start = null;
          activity.valid_time_end = null;
        } else {
          if (activity.period_type === 3) {
            if (!activity.month_day || activity.month_day <= 0) {
              this.activityErrMsg = `活动${this.chnNumChar[index]}：每月活动日应输入1～28之间整数`;
              return false;
            }
          }
          const valid_time_start = DateFormatHelper.getSecondTimeSum(activity.valid_time_start);
          const valid_time_end = DateFormatHelper.getSecondTimeSum(activity.valid_time_end);

          if (valid_time_start >= valid_time_end) {
            this.activityErrMsg = `活动${this.chnNumChar[index]}：活动开始时间应小于活动结束时间！`;
            return false;
          }
          activity.valid_time_start = valid_time_start;
          activity.valid_time_end = valid_time_end;
        }

        if (!activity.activity_fee) {
          this.activityErrMsg = `活动${this.chnNumChar[index]}：活动价格应大于0！`;
          return false;
        }

        if (Math.round(activity.activity_fee * 100) > this.specificationData.sale_fee) {
          this.activityErrMsg = `活动${this.chnNumChar[index]}：活动价格不得大于规格售价！`;
          return false;
        }

        if (activity.activity_num < 0) {
          this.activityErrMsg = `活动${this.chnNumChar[index]}：活动数量应大于等于0！`;
          return false;
        }
        if (this.isCreateActivity) {
          delete activity.is_deleted;
        } else {
          activity.wash_car_activity_id = activity.wash_car_activity_id || '';
        }
        tempActivityList.push(activity.toEditJson());
      }
    }
    this.editActivityParams.wash_car_activities = tempActivityList.concat(this.removeList);
    return true;
  }

  // 清空
  public clear(): void {
    this.activityErrMsg = '';
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

  public onOpenChange(event: any, data: WashCarSpecificationEntity): void {
    if (event) {
      if (data.valid_date_start) {
        this.selectedActivity.valid_date_start = data.clone().valid_date_start;
      } else {
        this.selectedActivity.valid_date_start = '';
      }

      if (data.valid_date_end) {
        this.selectedActivity.valid_date_end = data.clone().valid_date_end;
      } else {
        this.selectedActivity.valid_date_end = '';
      }
    }
  }

  // 自定义开始时间的禁用部分
  public disabledValidStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledFutureStartTime(startValue, this.selectedActivity.valid_date_end);
  }

  // 自定义结束时间的禁用部分
  public disabledValidEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledFutureEndTime(endValue, this.selectedActivity.valid_date_start);
  }

  // 处理自定义开始时间为0秒
  public onValidStartChange(event: any, data: WashCarActivityEntity) {
    this.clear();
    data.valid_date_start = event ? new Date(event).setHours(new Date(event).getHours(),
      new Date(event).getMinutes(), 0, 0) : '';
  }
  // 处理自定义结束时间为0秒
  public onValidEndChange(event: any, data: WashCarActivityEntity) {
    this.clear();
    data.valid_date_end = event ? new Date(event).setHours(new Date(event).getHours(),
      new Date(event).getMinutes(), 0, 0) : '';
  }
}
