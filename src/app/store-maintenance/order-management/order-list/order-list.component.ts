import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import {
  UpkeepOrderEntity,
  OrderManagementService,
  SearchOrderParams,
} from '../order-management.service';
import { Subject, Subscription } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';
import { environment } from '../../../../environments/environment';

const PageSize = 15;

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  public orderList: Array<UpkeepOrderEntity> = [];
  public pageIndex = 1;
  public searchParams = new SearchOrderParams();
  public noResultText = '数据加载中...';
  public start_pay_time = null; // 支付时间
  public end_pay_time = null;
  public start_reserve_time = null; // 预定时间
  public end_reserve_time = null;
  public workerList: Array<any> = [];

  private searchText$ = new Subject<any>();
  private searchBrandText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;
  private startPayValue: Date | null = null; // 支付时间
  private endPayValue: Date | null = null;
  private startReserveValue: Date | null = null; // 预定时间
  private endReserveValue: Date | null = null;
  private searchUrl: string;

  private get pageCount(): number {
    if (this.orderList.length % PageSize === 0) {
      return this.orderList.length / PageSize;
    }
    return this.orderList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService, private orderService: OrderManagementService) { }

  ngOnInit() {
    // 订单管理列表
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.orderService.requestOrderList(this.searchParams))
    ).subscribe(res => {
      this.orderList = res.results.map(i => ({ ...i, item_categorys: i.upkeep_item_categorys ? i.upkeep_item_categorys.split(',') : [] }));
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
      this.exportSearchUrl();
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 导出url
  private exportSearchUrl() {
    this.searchUrl = `${environment.OPERATION_SERVE}/upkeep_orders/export?pay_status=
    ${this.searchParams.pay_status}&vehicle_brand_name=${this.searchParams.vehicle_brand_name}
    &upkeep_item_category=${this.searchParams.upkeep_item_category}&payer_phone=
    ${this.searchParams.payer_phone}&payer_name=${this.searchParams.payer_name}
    &upkeep_merchant_name=${this.searchParams.upkeep_merchant_name}&upkeep_order_id=
    ${this.searchParams.upkeep_order_id}&pay_time=${this.searchParams.pay_time}
    &reserve_time=${this.searchParams.reserve_time}`;
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
    if (!startValue || !this.endReserveValue) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.endReserveValue).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 预定结束时间校验
  public disabledEndReserveDate = (endValue: Date): boolean => {
    if (!endValue || !this.startReserveValue) {
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
    if (this.getTimeValid() === 'pay_time') {
      this.globalService.promptBox.open('支付开始时间不能大于结束时间!', null, 2000, '/assets/images/warning.png');
    } else if (this.getTimeValid() === 'reserve_time') {
      this.globalService.promptBox.open('预定开始时间不能大于结束时间!', null, 2000, '/assets/images/warning.png');
    } else {
      this.pageIndex = 1;
      this.searchText$.next();
    }
  }

  /** 完成服务 */
  public onCompleteService(data: UpkeepOrderEntity) {
    this.globalService.confirmationBox.open('提示', `此操作不可逆，请确认是否已完成保养服务，<br>且车主已知晓并同意完成服务？`, () => {
      this.globalService.confirmationBox.close();
      // this.productService.requestDeleteProductData(data.product_id).subscribe(() => {
      //   this.globalService.promptBox.open('删除成功', () => {
      //     this.searchText$.next();
      //   });
      // },err => {
      //   this.globalService.httpErrorProcess(err);
      // });
    });
  }

  // 查询时间校验
  private getTimeValid(): string {
    this.searchParams.pay_time = (this.start_pay_time || this.end_pay_time)
      ? this.getPaySectionTime(this.start_pay_time, this.end_pay_time) : '';
    this.searchParams.reserve_time = this.getSectionTime(this.start_reserve_time, this.end_reserve_time);
    const pay_time = this.searchParams.pay_time;
    const reserve_time = this.searchParams.reserve_time;
    const pay_start_time = pay_time.split(',')[0];
    const pay_end_time = pay_time.split(',')[1];
    const reserve_start_time = reserve_time.split(',')[0];
    const reserve_end_time = reserve_time.split(',')[1];
    if ((pay_start_time !== '0' && pay_end_time !== '0') && pay_start_time > pay_end_time) {
      return 'pay_time';
    } else if (reserve_start_time !== '0' && reserve_start_time > reserve_end_time) {
      return 'reserve_time';
    } else {
      return '';
    }
  }

  // 获取支付时间时间戳
  public getPaySectionTime(start: any, end: any): string {
    const startTime = start ? (new Date(start).setHours(new Date(start).getHours(),
      new Date(start).getMinutes(), 0, 0) / 1000).toString() : 0;
    const endTime = end ? (new Date(end).setHours(new Date(end).getHours(),
      new Date(end).getMinutes(), 59, 0) / 1000).toString() : 0;
    return `${startTime},${endTime}`;
  }

  // 获取预定时间时间戳
  public getSectionTime(start: any, end: any): string {
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
      this.continueRequestSubscription = this.orderService.continueOrderList(this.linkUrl).subscribe(res => {
        this.orderList = this.orderList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }
}
