import { Component, OnInit } from '@angular/core';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { GlobalService } from 'src/app/core/global.service';
import { IntegralOrderHttpService, SearchIntegralOrderParams, IntegralOrderEntity } from '../integral-order-http.service';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.less', '../../../../../../assets/less/tab-bar-list.less']
})
export class OrderListComponent implements OnInit, NzSearchAdapter {
  public nzSearchAssistant: NzSearchAssistant;

  public searchParams: SearchIntegralOrderParams = new SearchIntegralOrderParams(); // 条件筛选
  public orderList: Array<IntegralOrderEntity> = []; // 产品订单列表
  public tabList = [
    { key: 0, label: '全部' },
    { key: 1, label: '已完成' },
    { key: 2, label: '已关闭' }
  ];
  public activeTabIndex = 0;
  public order_start_time: any = ''; // 下单开始时间
  public order_end_time: any = ''; // 下单结束时间
  public pay_start_time: any = ''; // 支付开始时间
  public pay_end_time: any = ''; // 支付结束时间

  constructor(
    private globalService: GlobalService,
    private orderHttpService: IntegralOrderHttpService) { }

  public ngOnInit() {
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  // 切换tab
  public onTabChange(key: number) {
    this.nzSearchAssistant.nzData = [];
    this.searchParams = new SearchIntegralOrderParams();
    this.order_start_time = '';
    this.order_end_time = '';
    this.pay_start_time = '';
    this.pay_end_time = '';
    if (key === 0) {
      this.searchParams.pay_status = null;
    } else if (key === 1) {
      this.searchParams.order_status = 2;
    } else if (key === 2) {
      this.searchParams.pay_status = 3;
    }
    this.nzSearchAssistant.submitSearch(true);
  }

  /* SearchDecorator 接口实现 */
  /* 请求检索 */
  public requestSearch(): any {
    return this.orderHttpService.requestIntegralOrderList(this.searchParams);
  }

  public continueSearch(url: string): any {
    return this.orderHttpService.continueIntegralOrderList(url);
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    const cTimeStamp = new Date().getTime() / 1000;
    const sTimestamp = this.order_start_time ? (new Date(this.order_start_time).setSeconds(0, 0) / 1000) : 0;
    const eTimeStamp = this.order_end_time ? (new Date(this.order_end_time).setSeconds(0, 0) / 1000) : cTimeStamp;
    const sPayTimestamp = this.pay_start_time ? (new Date(this.pay_start_time).setSeconds(0, 0) / 1000) : 0;
    const ePayTimeStamp = this.pay_end_time ? (new Date(this.pay_end_time).setSeconds(0, 0) / 1000) : cTimeStamp;
    if (sTimestamp > eTimeStamp) {
      this.globalService.promptBox.open('下单时间的开始时间不能大于结束时间！', null, 2000, null, false);
      return false;
    } else if (sPayTimestamp > ePayTimeStamp) {
      this.globalService.promptBox.open('支付时间的开始时间不能大于结束时间！', null, 2000, null, false);
      return false;
    }

    this.searchParams.order_section = `${sTimestamp},${eTimeStamp}`;
    this.searchParams.pay_section = `${sPayTimestamp},${ePayTimeStamp}`;

    return true;
  }

  /* 检索失败处理 */
  public searchErrProcess(err: any): any {
    this.globalService.httpErrorProcess(err);
  }

  /* 检索成功处理 */
  public searchCompleteProcess(): any { }


  // 下单开始时间的禁用部分
  public disabledOrderStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.order_end_time);
  }

  // 下单结束时间的禁用部分
  public disabledOrderEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.order_start_time);
  }

  // 支付开始时间的禁用部分
  public disabledStartPayTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.pay_end_time);
  }

  // 支付结束时间的禁用部分
  public disabledEndPayTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledEndTime(endValue, this.pay_start_time);
  }
}
