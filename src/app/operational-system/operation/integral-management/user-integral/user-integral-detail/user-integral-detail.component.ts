import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { UserIntegralHttpService, SearchIntegralDetailParams } from '../user-integral-http.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-integral-detail',
  templateUrl: './user-integral-detail.component.html',
  styleUrls: ['./user-integral-detail.component.css', '../../../../../../assets/less/tab-bar-list.less']
})
export class UserIntegralDetailComponent implements OnInit, NzSearchAdapter {
  public tab_key = 1;
  private user_id: string;
  public start_time: any = '';
  public end_time: any = '';
  public tabList = [
    { key: 1, label: '积分获取' },
    { key: 2, label: '积分消耗' },
    { key: 3, label: '失效积分 ' }
  ];
  public searchParams: SearchIntegralDetailParams = new SearchIntegralDetailParams();
  public nzSearchAssistant: NzSearchAssistant;
  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private globalService: GlobalService,
    private userIntegralHttpService: UserIntegralHttpService) {
    this.router.paramMap.subscribe(map => {
      this.user_id = map.get('user_id');
    });
  }

  ngOnInit() {
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  // 切换tab页时，重新获取数据
  public onTabChange(event: any): void {
    this.nzSearchAssistant.nzData = [];
    this.start_time = '';
    this.end_time = '';
    this.searchParams = new SearchIntegralDetailParams();
    this.nzSearchAssistant.submitSearch(false);
  }

  public onChangeStatus(status: any): void {
    if (status) {
      this.searchParams.issue_status = Number(status);
    }
  }

  /* SearchDecorator 接口实现 */

  public requestSearch(): any {
    this.searchParams.user_id = this.user_id;
    if (this.tab_key === 1) { // 积分获取记录
      return this.userIntegralHttpService.requestGainRecordList(this.searchParams);
    } else if (this.tab_key === 2) { // 积分消费记录
      return this.userIntegralHttpService.requestConsumeRecordList(this.searchParams);
    } else if (this.tab_key === 3) { // 积分失效记录
      return this.userIntegralHttpService.requestInvalidRecordList(this.searchParams);
    }
  }

  public continueSearch(url: string): any {
    if (this.tab_key === 1) { // 积分获取记录
      return this.userIntegralHttpService.continueGainRecordList(url);
    } else if (this.tab_key === 2) { // 积分消费记录
      return this.userIntegralHttpService.continueConsumeRecordList(url);
    } else if (this.tab_key === 3) { // 积分失效记录
      return this.userIntegralHttpService.continueInvalidRecordList(url);
    }
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    const tip = this.tab_key === 1 ? '产生时间'
      : this.tab_key === 2 ? '消耗时间' : '失效时间';
    const cTimestamp = new Date().getTime() / 1000;
    const sTimestamp = this.start_time ? new Date(this.start_time).setSeconds(0, 0) / 1000 : 0;
    const eTimeStamp = this.end_time ? new Date(this.end_time).setSeconds(0, 0) / 1000 : cTimestamp;

    if (sTimestamp > eTimeStamp) {
      this.globalService.promptBox.open(`${tip}的开始时间不能大于结束时间！`, null, 2000, null, false);
      return false;
    }
    this.searchParams.section = `${sTimestamp},${eTimeStamp}`;

    return true;
  }

  /* 检索失败处理 */
  public searchErrProcess(err: any): any {
    this.globalService.httpErrorProcess(err);
  }

  /* 检索成功处理 */
  public searchCompleteProcess(): any { }

  // 开始时间的禁用部分
  public disabledStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.end_time);
  }

  // 结束时间的禁用部分
  public disabledEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.start_time);
  }
}
