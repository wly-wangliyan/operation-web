import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  OrderStatisticEntity,
  StatisticSearchParams,
  WashOrderService
} from '../wash-car-order.service';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { GlobalConst } from '../../../../share/global-const';
import { GlobalService } from '../../../../core/global.service';
import { environment } from '../../../../../environments/environment';
import { DisabledTimeHelper } from '../../../../../utils/disabled-time-helper';
import { NzSearchAssistant } from '../../../../share/nz-search-assistant';

@Component({
  selector: 'app-statistic-data',
  templateUrl: './statistic-data.component.html',
  styleUrls: ['./statistic-data.component.css']
})
export class StatisticDataComponent implements OnInit, OnDestroy {

  public nzSearchAssistant: NzSearchAssistant;
  public searchParams: StatisticSearchParams = new StatisticSearchParams(); // 洗车订单
  public order_start_time: any = ''; // 下单开始时间
  public order_end_time: any = ''; // 下单结束时间]

  private searchUrl: string; // 导出url

  constructor(
      private globalService: GlobalService,
      private orderService: WashOrderService
  ) {
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  public ngOnInit() { }

  public ngOnDestroy(): void {
  }

  // 下单开始时间的禁用部分
  public disabledOrderStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.order_end_time);
  }

  // 下单结束时间的禁用部分
  public disabledOrderEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.order_start_time);
  }

  // 导出
  public onExportRecords(): void {
    if (this.generateAndCheckParamsValid()) {
      window.open(this.searchUrl);
    }
  }

  // 导出url
  private exportSearchUrl() {
    this.searchUrl = `${environment.STORE_DOMAIN}/admin/wash_car_order_statistics/export`;
    if (this.searchParams.section) {
      this.searchUrl += `?section=${this.searchParams.section}`;
    }
  }

  /* NzSearchAdapter 接口实现 */

  /* 请求检索 */
  public requestSearch(): any {
    return this.orderService.requestOrderStatisticsData(this.searchParams);
  }

  public continueSearch(url: string): any {
    return this.orderService.continueOrderStatisticData(url);
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.order_start_time ? (new Date(this.order_start_time).setHours(0, 0, 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.order_end_time ? (new Date(this.order_end_time).setHours(24, 0, 0, 0) / 1000).toString() : 253402185600;
    if (sTimestamp > eTimeStamp) {
      this.globalService.promptBox.open('统计范围开始时间不能大于结束时间！', null, 2000, null, false);
      return false;
    }
    if (this.order_start_time || this.order_end_time) {
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
  public searchCompleteProcess(results: Array<any>, isFuzzySearch: boolean) {
    this.exportSearchUrl();
  }
}
