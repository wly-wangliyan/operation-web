import { Component, OnInit } from '@angular/core';
import { NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../core/global.service';
import { PushService, SearchParams } from '../push.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';

@Component({
  selector: 'app-push-log-list',
  templateUrl: './push-log-list.component.html',
  styleUrls: ['./push-log-list.component.css']
})
export class PushLogListComponent implements OnInit {
  public nzSearchAssistant: NzSearchAssistant;
  public searchParams = new SearchParams();
  public start_time = null;
  public end_time = null;

  constructor(
      private globalService: GlobalService,
      private pushService: PushService
  ) {
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  public ngOnInit() { }

  /* NzSearchAdapter 接口实现 */

  /* 请求检索 */
  public requestSearch(): any {
    return this.pushService.requestPushMessageList();
  }

  public continueSearch(url: string): any {
    return this.pushService.continuePushMessageListData(url);
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.start_time ? (new Date(this.start_time).setHours(new Date(this.start_time).getHours(),
        new Date(this.start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.end_time ? (new Date(this.end_time).setHours(new Date(this.end_time).getHours(),
        new Date(this.end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    if (sTimestamp && eTimeStamp) {
      if (sTimestamp > eTimeStamp) {
        this.globalService.promptBox.open('上线开始时间不能大于结束时间！', null, 2000, null, false);
        return false;
      }
    }
    this.searchParams.section = sTimestamp + ',' + eTimeStamp;
    return true;
  }

  /* 检索失败处理 */
  public searchErrProcess(err: any) {
    this.globalService.httpErrorProcess(err);
  }

  /* 检索成功处理 */
  public searchCompleteProcess(results: Array<any>, isFuzzySearch: boolean) { }

  // 开始时间的禁用部分
  public disabledStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.end_time);
  }

  // 结束时间的禁用部分
  public disabledEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.start_time);
  }
}
