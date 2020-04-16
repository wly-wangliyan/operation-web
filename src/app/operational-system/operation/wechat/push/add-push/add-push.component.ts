import { Component, OnInit, ViewChild } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { GlobalService } from '../../../../../core/global.service';
import { PushService, PushMessageEntity } from '../push.service';
import { ActivatedRoute } from '@angular/router';
import { ErrMessageGroup, ErrMessageBase } from '../../../../../../utils/error-message-helper';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { InsertLinkComponent } from './insert-link/insert-link.component';
import { UploadImageComponent } from '../../components/upload-image/upload-image.component';

enum MsgTagType {
  'subscribe' = '关注',
  'dialogue' = '对话',
  'scan' = '扫码',
  'menu' = '点击菜单',
}

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
  public isCreate = true;
  public loading = true;
  public msg_tags: Array<CheckItem> = []; // 推送对象
  public start_time: any = ''; // 生效间隔-开始时间
  public end_time: any = ''; // 生效间隔-结束时间
  public isCheckedAll: boolean; // 标记推送对象是否全选
  public errMessageGroup: ErrMessageGroup = new ErrMessageGroup();
  public tabList = [{ key: 'text', value: '文本信息' }, { key: 'image', value: '图片' }];
  public msgTagType = MsgTagType;
  public safeUrl: any; // 本地图片地址
  private saving = false; // 标记是否正在保存

  @ViewChild('insertLinkModal', { static: true }) public insertLinkModalRef: InsertLinkComponent;
  @ViewChild('uploadWxImage', { static: true }) public uploadImageComponent: UploadImageComponent;

  constructor(
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private pushService: PushService) {
    this.route.paramMap.subscribe(map => {
      this.push_message_id = map.get('push_message_id');
    });
  }

  public ngOnInit() {
    this.clear();
    if (this.push_message_id) {
      this.isCreate = false;
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

  public onTabChange(key: string): void {
    this.editParams.content = '';
    this.editParams.title = '';
    this.editParams.link = '';
    this.editParams.media_id = null;
    this.safeUrl = null;
  }

  // 点击上传图片
  public onSelectPictureClick() {
    this.uploadImageComponent.open();
  }

  // 接收图片信息
  public onSelectedImgChange(event: any): void {
    if (event) {
      this.editParams.media_id = event.media_id;
      this.safeUrl = event.safeUrl;
    }
  }

  // 清除错误信息
  public clear(): void {
    this.errMessageGroup.errJson = {};
    this.errMessageGroup.errJson.time = new ErrMessageBase();
    this.errMessageGroup.errJson.content = new ErrMessageBase();
  }

  // 表单必填数据校验
  public ifDisabled(): boolean {
    return !this.msg_tags.some(checkItem => checkItem.isChecked)
      || !this.start_time || !this.end_time ||
      this.editParams.send_type === 'image' && !this.editParams.media_id;
    // || this.editParams.send_type === 'text' && (!this.link_name || !this.link_url)
  }

  // 初始化推送对象数据
  private initMsgTags() {
    const tags = ['subscribe', 'dialogue', 'scan', 'menu'];
    this.msg_tags = [];
    const checked_tags = this.editParams.msg_tags ? this.editParams.msg_tags.split(',') : [];
    tags.forEach(tag => {
      const checkItem = new CheckItem(null, tag);
      if (this.editParams.msg_tags && checked_tags.includes(tag)) {
        checkItem.isChecked = true;
      }
      this.msg_tags.push(checkItem);
    });
    this.isCheckedAll = this.msg_tags && this.msg_tags.length > 0 && this.msg_tags.every(tag => tag.isChecked === true);

    if (!this.isCreate) {
      this.tabList = this.tabList.filter(tab => tab.key === this.editParams.send_type);
      this.start_time = this.editParams.start_time ? this.editParams.start_time * 1000 : '';
      this.end_time = this.editParams.end_time ? this.editParams.end_time * 1000 : '';
    } else {
      this.editParams.request_date = this.editParams.request_date ? this.editParams.request_date : new Date().getTime();
    }
    this.editParams.send_type = this.editParams.send_type || 'text';
  }

  // 修改推送对象是否全选
  public onChangeCheckAll(event: any): void {
    this.msg_tags.forEach(tag => tag.isChecked = event);
  }

  // 变更推送对象
  public onChangeTag(): void {
    this.isCheckedAll = this.msg_tags && this.msg_tags.length > 0 && this.msg_tags.every(tag => tag.isChecked === true);
  }

  // 插入小程序
  public onOpenLinkModal(): void {
    this.insertLinkModalRef.open(this.editParams.title, this.editParams.link);
  }

  // 接收小程序链接信息
  public onChangeLink(event: any): void {
    if (event) {
      this.editParams.title = event.link.link_name;
      this.editParams.link = event.link.link_url;
    }
  }

  // 发布
  public onEditFormSubmit(): void {
    if (this.saving) {
      return;
    }
    this.clear();
    if (this.generateAndCheckParamsValid()) {
      this.globalService.confirmationBox.open('提示', '请确认 \n 是否立即推送此消息?', () => {
        this.globalService.confirmationBox.close();
        this.requestAddPushMessage();
      });
    } else {
      this.saving = false;
    }
  }

  // 发送消息
  private requestAddPushMessage(): void {
    this.pushService.requestAddPushMessageData(this.editParams)
      .subscribe(res => {
        this.globalService.promptBox.open('发布成功', () => {
          window.history.back();
        });
      }, err => {
        this.saving = false;
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 422) {
            this.globalService.promptBox.open('数据缺失或非法', null, 2000, null, false);
          }
        }
      });
  }

  // 校验数据
  private generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.start_time ? (new Date(this.start_time).setHours(new Date(this.start_time).getHours(),
      new Date(this.start_time).getMinutes(), 0, 0) / 1000) : 0;
    const eTimeStamp = this.end_time ? (new Date(this.end_time).setHours(new Date(this.end_time).getHours(),
      new Date(this.end_time).getMinutes(), 0, 0) / 1000) : null;
    const currentTimeStamp = new Date().getTime() / 1000;
    if (sTimestamp >= eTimeStamp) {
      this.errMessageGroup.errJson.time.errMes = '开始时间应小于结束时间！';
      return false;
    }

    if (sTimestamp && currentTimeStamp - sTimestamp > 86400 * 2) {
      this.errMessageGroup.errJson.time.errMes = '开始时间距离当前时间不能超过48小时！';
      return false;
    }
    if (eTimeStamp && eTimeStamp > currentTimeStamp) {
      this.errMessageGroup.errJson.time.errMes = '结束时间不能大于当前时间！';
      return false;
    }
    this.editParams.start_time = sTimestamp;
    this.editParams.end_time = eTimeStamp;
    const tags = this.msg_tags.filter(tagItem => tagItem.isChecked).map(tag => tag.isChecked && tag.name);
    this.editParams.msg_tags = tags.join(',');
    return true;
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
  private onValidSecondsZero(date: any): any {
    return new Date(date).setHours(new Date(date).getHours(),
      new Date(date).getMinutes(), 0, 0);
  }
}
