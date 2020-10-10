import { Component, OnInit } from '@angular/core';
import { SearchUserIntegralParams, UserIntegralHttpService } from '../../user-integral/user-integral-http.service';
import { NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../core/global.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.css']
})
export class RecordListComponent implements OnInit {

  public searchParams: SearchUserIntegralParams = new SearchUserIntegralParams();
  public nzSearchAssistant: NzSearchAssistant;
  public start_time: any = '';
  public end_time: any = '';

  constructor(
      private globalService: GlobalService,
      private userIntegralHttpService: UserIntegralHttpService) { }

  ngOnInit() {
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  // 数据导出
  public onExport() {
    if (this.generateAndCheckParamsValid()) {
      let searchUrl = `${environment.EXEMPTION_DOMAIN}/exemption/orders/export?default=1`;
      const params = this.searchParams.json();
      delete params.page_num;
      delete params.page_size;
      for (const key in params) {
        if (params[key]) {
          searchUrl += `&${key}=${params[key]}`;
        }
      }
      window.open(searchUrl);
    }
  }

  // 开始时间的禁用部分
  public disabledStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.end_time);
  };

  // 结束时间的禁用部分
  public disabledEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.start_time);
  };

  /* SearchDecorator 接口实现 */
  /* 请求检索 */
  public requestSearch(): any {
    return this.userIntegralHttpService.requestUserIntegralList(this.searchParams);
  }

  public continueSearch(url: string): any {
    return this.userIntegralHttpService.continueUserIntegralList(url);
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    const cTime = new Date().getTime() / 1000;
    const sTime = this.start_time ? ((new Date(this.start_time).setSeconds(0, 0) / 1000)) : 0;
    const eTime = this.end_time ? ((new Date(this.end_time).setSeconds(0, 0) / 1000)) : cTime;
    if (sTime > eTime) {
      this.globalService.promptBox.open('创建时间的开始时间应小于等于结束时间！', null, 2000, null, false);
      return false;
    }
    // todo
    // this.searchParams.section = `${sTime},${eTime}`;
    return true;
  }

  /* 检索失败处理 */
  public searchErrProcess(err: any): any {
    this.globalService.httpErrorProcess(err);
  }

  /* 检索成功处理 */
  public searchCompleteProcess(): any { }

}
