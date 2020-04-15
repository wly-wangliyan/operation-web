import { Component, OnInit } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { GlobalService } from '../../../../../core/global.service';
import { PushService, PushMessageEntity } from '../push.service';
import { ActivatedRoute } from '@angular/router';
import { ErrMessageGroup, ErrMessageBase } from '../../../../../../utils/error-message-helper';
import { environment } from '../../../../../../environments/environment';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { DateFormatHelper } from '../../../../../../utils/date-format-helper';

export class CheckItem {
  key: number;
  name: string;
  isChecked: boolean;
  constructor(key?: number, name?: string, isChecked: boolean = false) {
    this.key = key;
    this.name = name;
    this.isChecked = isChecked;
  }
}

@Component({
  selector: 'app-add-push',
  templateUrl: './add-push.component.html',
  styleUrls: ['./add-push.component.css']
})
export class AddPushComponent implements OnInit {
  public editParams: PushMessageEntity = new PushMessageEntity();
  public title = '新建推送';
  private push_message_id: string; // 推送记录id
  public loading = true;
  public msg_tags: Array<CheckItem> = [];
  public start_time: any = ''; // 生效间隔-开始时间
  public end_time: any = ''; // 生效间隔-结束时间
  public isCheckedAll: boolean; // 标记推送对象是否全选
  public errMessageGroup: ErrMessageGroup = new ErrMessageGroup();
  public link_name: string; // 插入小程序-链接名称
  private appid = environment.version === 'r' ? 'wxb3b23f913746f653' : 'wx5041d139e198b0af';
  public link: string; // 插入小程序-链接
  private saving = false; // 标记是否正在保存

  constructor(
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private pushService: PushService) {
    route.queryParams.subscribe(queryParams => {
      this.push_message_id = queryParams.push_message_id;
    });
  }

  public ngOnInit() {
    this.clear();
    if (this.push_message_id) {
      this.title = '查看推送信息';
      this.getPushDetail();
    } else {
      this.initMsgTags();
      this.loading = false;
    }
  }

  // 获取推送详情
  private getPushDetail(): void {
    this.pushService.requestPushMessageDetail(this.push_message_id)
      .subscribe(backData => {
        this.editParams = backData;
        this.initMsgTags();
        this.loading = false;
      }, err => {
        this.loading = false;
        this.globalService.httpErrorProcess(err);
      });
  }

  // 清除错误信息
  public clear(): void {
    this.errMessageGroup.errJson = {};
    this.errMessageGroup.errJson.time = new ErrMessageBase();
    this.errMessageGroup.errJson.msg_tags = new ErrMessageBase();
    this.errMessageGroup.errJson.content = new ErrMessageBase();
    this.errMessageGroup.errJson.media_id = new ErrMessageBase();
  }

  public ifDisabled(): boolean {
    return !this.msg_tags.some(checkItem => checkItem.isChecked)
      || !this.start_time || !this.end_time ||
      this.editParams.send_type === 'image' && !this.editParams.media_id
      || this.editParams.send_type === 'text' && (!this.link_name || !this.link);
  }

  private initMsgTags() {
    const tags = ['subscribe', 'dialogue', 'scan', 'menu'];
    this.msg_tags = [];
    tags.forEach(tag => {
      const checkItem = new CheckItem(null, tag);
      if (this.editParams.msg_tags && this.editParams.msg_tags.includes(tag)) {
        checkItem.isChecked = true;
      }
      this.msg_tags.push(checkItem);
    });
  }

  // 修改推送对象是否全选
  public onChangeCheckAll(event: any): void {
    this.msg_tags.forEach(tag => tag.isChecked = event);
  }

  // 变更推送对象
  public onChangeTag(): void {
    this.isCheckedAll = this.msg_tags && this.msg_tags.length > 0 && this.msg_tags.every(tag => tag.isChecked === true);
  }

  // 开始时间的禁用部分
  public disabledStartTime = (startValue: Date): boolean => {
    const twoDaysAgo = new Date(new Date().getTime() - 86400000 * 2);
    if (differenceInCalendarDays(startValue, twoDaysAgo) < 0) {
      return true;
    }
    return DisabledTimeHelper.disabledStartTime(startValue, this.end_time);
  }

  // 结束时间的禁用部分
  public disabledEndTime = (endValue: Date): boolean => {
    const twoDaysAgo = new Date(new Date().getTime() - 86400000 * 2);
    if (differenceInCalendarDays(endValue, twoDaysAgo) < 0) {
      return true;
    }
    return DisabledTimeHelper.disabledEndTime(endValue, this.start_time);
  }

  // 处理时间秒数为0
  public onValidSecondsZero(date: any, ): any {
    return new Date(date).setHours(new Date(date).getHours(),
      new Date(date).getMinutes(), 0, 0);
  }
}
