import { Component, OnInit, ViewChild } from '@angular/core';
import { NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../core/global.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { ActivityBusinessService, ActivityEntity, SearchParams } from '../activity-business.service';

@Component({
  selector: 'app-activity-business-list',
  templateUrl: './activity-business-list.component.html',
  styleUrls: ['./activity-business-list.component.css']
})
export class ActivityBusinessListComponent implements OnInit {

  public start_time: null; // 开始时间
  public end_time: null; // 结束时间
  public searchParams: SearchParams = new SearchParams(); // 条件筛选参数
  public nzSearchAssistant: NzSearchAssistant;
  public currentActivity: ActivityEntity = new ActivityEntity();

  constructor(private globalService: GlobalService,
              private activityService: ActivityBusinessService) {
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  ngOnInit() {
  }

  // 新建、编辑活动
  public onCreateClick() {
    this.currentActivity = new ActivityEntity();
    $('#activityBusinessPromptDiv').modal('show');
  }

  public onEditClick(data: ActivityEntity) {

  }

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      this.onEditActivitySubmit();
      return false;
    }
  }

  // 数据提交
  public onEditActivitySubmit() {
    this.activityService.requestAddActivity(this.currentActivity).subscribe(res => {
      $('#activityBusinessPromptDiv').modal('hide');
      this.nzSearchAssistant.submitSearch(false);
      this.globalService.promptBox.open('保存成功！');
    }, err => {
      this.globalService.promptBox.open('保存失败，请重试!', null, 2000, null, false);
      this.globalService.httpErrorProcess(err);
    });
  }

  // 创建开始时间的禁用部分
  public disabledStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.end_time);
  }

  // 创建结束时间的禁用部分
  public disabledEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.start_time);
  }

  /* NzSearchAdapter 接口实现 */

  /* 请求检索 */
  public requestSearch(): any {
    return this.activityService.requestActivityList(this.searchParams);
  }

  public continueSearch(url: string): any {
    return this.activityService.continueActivityList(url);
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.start_time ? (new Date(this.start_time).setHours(new Date(this.start_time).getHours(),
        new Date(this.start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.end_time ? (new Date(this.end_time).setHours(new Date(this.end_time).getHours(),
        new Date(this.end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;

    if (sTimestamp > eTimeStamp) {
      this.globalService.promptBox.open('创建开始时间不能大于结束时间！', null, 2000, null, false);
      return false;
    }

    if (this.start_time || this.end_time) {
      this.searchParams.section = `${sTimestamp},${eTimeStamp}`;
    } else {
      this.searchParams.section = null;
    }
    return true;
  }

  /* 检索失败处理 */
  public searchErrProcess(err: any) {
    this.globalService.httpErrorProcess(err);
  }

  /* 检索成功处理 */
  public searchCompleteProcess(results: Array<any>, isFuzzySearch: boolean) { }
}
