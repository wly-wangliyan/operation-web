// import { Component, OnInit, ViewChild } from '@angular/core';
// import { Subject, Subscription, timer } from 'rxjs';
// import { GlobalService } from '../../../../core/global.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { debounceTime, switchMap } from 'rxjs/operators';
// import { BrokerageEntity, OrderManagementService } from '../order-management.service';

// const PageSize = 15;

// @Component({
//   selector: 'app-order-list',
//   templateUrl: './order-list.component.html',
//   styleUrls: ['./order-list.component.css']
// })
// export class OrderListComponent implements OnInit {
//   public brokerageList: Array<BrokerageEntity> = [];
//   public pageIndex = 1;
//   public noResultText = '数据加载中...';

//   private searchText$ = new Subject<any>();
//   private continueRequestSubscription: Subscription;
//   private linkUrl: string;

//   private get pageCount(): number {
//     if (this.brokerageList.length % PageSize === 0) {
//       return this.brokerageList.length / PageSize;
//     }
//     return this.brokerageList.length / PageSize + 1;
//   }

//   constructor(private globalService: GlobalService,
//               private orderService: OrderManagementService) {
//   }

//   ngOnInit() {
//     this.searchText$.pipe(
//       debounceTime(500),
//       switchMap(() =>
//         this.orderService.requestBrokerageList())
//     ).subscribe(res => {
//       this.brokerageList = res.results;
//       this.brokerageList.forEach(value => {
//         const ic_company_name = [];
//         value.ic_company.forEach(value1 => {
//           ic_company_name.push(value1.ic_name);
//         });
//         value.ic_company_name = ic_company_name.join(',');
//       });
//       this.linkUrl = res.linkUrl;
//       this.noResultText = '暂无数据';
//     }, err => {
//       this.globalService.httpErrorProcess(err);
//     });
//     this.searchText$.next();
//   }


//   // 翻页方法
//   public onNZPageIndexChange(pageIndex: number) {
//     this.pageIndex = pageIndex;
//     if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
//       // 当存在linkUrl并且快到最后一页了请求数据
//       this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
//       this.continueRequestSubscription = this.orderService.continueBrokerageList(this.linkUrl).subscribe(res => {
//         this.brokerageList = this.brokerageList.concat(res.results);
//         this.linkUrl = res.linkUrl;
//       }, err => {
//         this.globalService.httpErrorProcess(err);
//       });
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../core/global.service';
import {
  BrokerageEntity,
  OrderManagementService,
  SearchOrderParams,
} from '../order-management.service';
import { Subject, Subscription } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';
import { environment } from '../../../../../environments/environment';

const PageSize = 15;

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  public orderList: Array<BrokerageEntity> = [];
  public pageIndex = 1;
  public searchParams = new SearchOrderParams();
  public noResultText = '数据加载中...';
  public start_created_time = null; // 下单时间
  public end_created_time = null;
  public start_pay_time = null; // 支付时间
  public end_pay_time = null;
  public start_reserve_time = null; // 预定时间
  public end_reserve_time = null;
  public workerList: Array<any> = [];

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;
  private startCreatedValue: Date | null = null;
  private endCreatedValue: Date | null = null;
  private startPayValue: Date | null = null;
  private endPayValue: Date | null = null;
  private startReserveValue: Date | null = null;
  private endReserveValue: Date | null = null;
  private tab = 2;
  private searchUrl: string;


  private get pageCount(): number {
    if (this.orderList.length % PageSize === 0) {
      return this.orderList.length / PageSize;
    }
    return this.orderList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService, private orderService: OrderManagementService) { }

  ngOnInit() {
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.orderService.requestBrokerageList())
    ).subscribe(res => {
      this.orderList = res.results;
      this.orderList.forEach(value => {
        const ic_company_name = [];
        value.ic_company.forEach(value1 => {
          ic_company_name.push(value1.ic_name);
        });
        value.ic_company_name = ic_company_name.join(',');
      });
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
      // tslint:disable-next-line:max-line-length
      this.searchUrl = `${environment.OPERATION_SERVE}/admin/carline_records/export?pay_status=${this.searchParams.pay_status}&vehicle_brand_name=${this.searchParams.vehicle_brand_name}&upkeep_item_category=${this.searchParams.upkeep_item_category}&payer_phone=${this.searchParams.payer_phone}&payer_name=${this.searchParams.payer_name}&upkeep_merchant_name=${this.searchParams.upkeep_merchant_name}&upkeep_order_id=${this.searchParams.upkeep_order_id}&created_time=${this.searchParams.created_time}&pay_time=${this.searchParams.pay_time}&reserve_time=${this.searchParams.reserve_time}`;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 下单开始时间校验
  public disabledStartCreatedDate = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.endCreatedValue) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.endCreatedValue).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 下单结束时间校验
  public disabledEndCreatedDate = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.startCreatedValue) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.startCreatedValue).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  public onStartCreatedChange(date: Date): void {
    this.startCreatedValue = date;
  }

  public onEndCreatedChange(date: Date): void {
    this.endCreatedValue = date;
  }


  // 支付开始时间校验
  public disabledStartPayDate = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.endPayValue) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.endPayValue).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 支付结束时间校验
  public disabledEndPayDate = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.startPayValue) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.startPayValue).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  public onStartPayChange(date: Date): void {
    this.startPayValue = date;
  }

  public onEndPayChange(date: Date): void {
    this.endPayValue = date;
  }

  // 预定开始时间校验
  public disabledStartReserveDate = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.endReserveValue) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.endReserveValue).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 预定结束时间校验
  public disabledEndReserveDate = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.startReserveValue) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.startReserveValue).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  public onStartReserveChange(date: Date): void {
    this.startReserveValue = date;
  }

  public onEndReserveChange(date: Date): void {
    this.endReserveValue = date;
  }

  // 查询按钮
  public onSearchBtnClick() {
    this.searchParams.payer_phone = this.searchParams.payer_phone.trim();
    this.searchParams.payer_name = this.searchParams.payer_name.trim();
    this.searchParams.upkeep_merchant_name = this.searchParams.upkeep_merchant_name.trim();
    this.searchParams.upkeep_order_id = this.searchParams.upkeep_order_id.trim();
    if (this.getTimeValid() === 'created_time') {
      this.globalService.promptBox.open('查询失败', '下单开始时间不能大于结束时间!');
    } else if (this.getTimeValid() === 'pay_time') {
      this.globalService.promptBox.open('查询失败', '支付开始时间不能大于结束时间!');
    } else if (this.getTimeValid() === 'reserve_time') {
      this.globalService.promptBox.open('查询失败', '预定开始时间不能大于结束时间!');
    } else {
      this.searchText$.next();
    }
  }

  // 导出订单管理列表
  public onExportOrderList() {
    if (this.getTimeValid() === 'created_time') {
      this.globalService.promptBox.open('查询失败', '下单开始时间不能大于结束时间!');
    } else if (this.getTimeValid() === 'pay_time') {
      this.globalService.promptBox.open('查询失败', '支付开始时间不能大于结束时间!');
    } else if (this.getTimeValid() === 'reserve_time') {
      this.globalService.promptBox.open('查询失败', '预定开始时间不能大于结束时间!');
    } else {
      if (this.searchUrl) {
        window.open(this.searchUrl);
      }
    }
  }

  // 查询时间校验
  private getTimeValid(): string {
    this.searchParams.created_time = this.getSectionTime(this.start_created_time, this.end_created_time);
    this.searchParams.pay_time = this.getSectionTime(this.start_pay_time, this.end_pay_time);
    this.searchParams.reserve_time = this.getSectionTime(this.start_reserve_time, this.end_reserve_time);
    const created_time = this.searchParams.created_time;
    const pay_time = this.searchParams.pay_time;
    const reserve_time = this.searchParams.reserve_time;
    if (created_time.split(',')[0] !== '0' && created_time.split(',')[0] > created_time.split(',')[1]) {
      return 'created_time';
    } else if (pay_time.split(',')[0] !== '0' && pay_time.split(',')[0] > pay_time.split(',')[1]) {
      return 'pay_time';
    } else if (reserve_time.split(',')[0] !== '0' && reserve_time.split(',')[0] > reserve_time.split(',')[1]) {
      return 'reserve_time';
    } else {
      return '';
    }
  }

  // 获取下单时间时间戳
  public getSectionTime(start, end): string {
    const startTime = start ? (new Date(start).setHours(new Date(start).getHours(),
      new Date(start).getMinutes(), 0, 0) / 1000).toString() : 0;
    const endTime = end ? (new Date(end).setHours(new Date(end).getHours(),
      new Date(end).getMinutes(), 59, 0) / 1000).toString() : 253402185600;
    return `${startTime},${endTime}`;
  }

  // 分页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      // tslint:disable-next-line:no-unused-expression
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.orderService.continueBrokerageList(this.linkUrl).subscribe(res => {
        this.orderList = this.orderList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

}
