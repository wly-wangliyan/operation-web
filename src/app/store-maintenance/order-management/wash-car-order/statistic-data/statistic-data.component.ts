import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  OrderStatisticEntity,
  StatisticSearchParams,
  WashOrderService
} from '../wash-car-order.service';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { GlobalConst } from '../../../../share/global-const';
import { GlobalService } from '../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { DisabledTimeHelper } from '../../../../../utils/disabled-time-helper';

@Component({
  selector: 'app-statistic-data',
  templateUrl: './statistic-data.component.html',
  styleUrls: ['./statistic-data.component.css']
})
export class StatisticDataComponent implements OnInit, OnDestroy {

  public statisticList: Array<OrderStatisticEntity> = []; // 洗车订单
  public searchParams: StatisticSearchParams = new StatisticSearchParams(); // 洗车订单
  public order_start_time: any = ''; // 下单开始时间
  public order_end_time: any = ''; // 下单结束时间

  public pageIndex = 1; // 当前页码
  public noResultText = '数据加载中...';
  private requestSubscription: Subscription; // 获取数据
  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription; // 分页获取数据
  private linkUrl: string; // 分页url
  private searchUrl: string;

  private get pageCount(): number {
    if (this.statisticList.length % GlobalConst.NzPageSize === 0) {
      return this.statisticList.length / GlobalConst.NzPageSize;
    }
    return this.statisticList.length / GlobalConst.NzPageSize + 1;
  }

  constructor(
      private globalService: GlobalService,
      private orderService: WashOrderService) { }

  public ngOnInit() {
    const temp = new OrderStatisticEntity();
    temp.specification_infos = [{specification_name: 'aaa', specification_num: 10},
      {specification_name: 'bbb', specification_num: 100},
      {specification_name: 'ccc', specification_num: 20}];
    this.statisticList.push(temp);
    this.statisticList.push(temp);
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.exportSearchUrl();
      this.requestOrderList();
    });
    this.searchText$.next();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 请求订单列表
  private requestOrderList(): void {
    const statisticsParams = this.searchParams.clone();
    delete statisticsParams.page_size;
    delete statisticsParams.page_num;
    this.requestSubscription = this.orderService.requestOrderStatisticsData(this.searchParams)
        .subscribe(result => {
          this.statisticList = result.results;
          this.linkUrl = result.linkUrl;
          this.pageIndex = 1;
          this.noResultText = '暂无数据';
          this.exportSearchUrl();
        }, err => {
          this.pageIndex = 1;
          this.noResultText = '暂无数据';
          this.globalService.httpErrorProcess(err);
        });
  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.orderService.continueOrderStatisticData(this.linkUrl)
          .subscribe(continueData => {
            this.statisticList = this.statisticList.concat(continueData.results);
            this.linkUrl = continueData.linkUrl;
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
    }
  }

  // 条件查询
  public onSearchBtnClick(): void {
    if (this.generateAndCheckParamsValid()) {
      this.searchText$.next();
    }
  }

  // 导出
  public onExportRecords(): void {
    if (this.generateAndCheckParamsValid()) {
      window.open(this.searchUrl);
    }
  }

  // 导出url
  private exportSearchUrl() {
    this.searchUrl = `${environment.STORE_DOMAIN}/admin/wash_car_order_statistics/export?section=${this.searchParams.section}`;
  }

  /* 生成并检查参数有效性 */
  private generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.order_start_time ? (new Date(this.order_start_time).setHours(0, 0, 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.order_end_time ? (new Date(this.order_end_time).setHours(0, 0, 0, 0) / 1000).toString() : 253402185600;
    if (sTimestamp > eTimeStamp) {
      this.globalService.promptBox.open('下单开始时间不能大于结束时间！', null, 2000, null, false);
      return false;
    }
    if (this.order_start_time || this.order_end_time) {
      this.searchParams.section = `${sTimestamp},${eTimeStamp}`;
    } else {
      this.searchParams.section = null;
    }
    return true;
  }

  // 下单开始时间的禁用部分
  public disabledOrderStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.order_end_time);
  }

  // 下单结束时间的禁用部分
  public disabledOrderEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.order_start_time);
  }
}
