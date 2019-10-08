import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GlobalService } from '../../../../core/global.service';
import { differenceInCalendarDays } from 'date-fns';
import { OrderManagementService, OrderEntity, SearchParams } from '../order-management.service';

const PageSize = 15;

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {

  public searchParams: SearchParams = new SearchParams(); // 条件筛选

  public order_status = ''; // 订单状态

  public orderList: Array<OrderEntity> = []; // 产品订单列表

  private requestSubscription: Subscription; // 获取数据

  public pageIndex = 1; // 当前页码

  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();

  private continueRequestSubscription: Subscription; // 分页获取数据

  private linkUrl: string; // 分页url

  private get pageCount(): number {
    if (this.orderList.length % PageSize === 0) {
      return this.orderList.length / PageSize;
    }
    return this.orderList.length / PageSize + 1;
  }

  public order_start_time: any = ''; // 下单开始时间
  public order_end_time: any = ''; // 下单结束时间

  public pay_start_time: any = ''; // 支付开始时间
  public pay_end_time: any = ''; // 支付结束时间

  constructor(
    private globalService: GlobalService,
    private orderService: OrderManagementService) { }

  public ngOnInit() {
    this.generateOrderList();
  }

  public ngOnDestroy() {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 初始化获取产品列表
  private generateOrderList() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestProductList();
    });
    this.searchText$.next();
  }

  // 请求产品列表
  private requestProductList() {
    this.orderService.requestOrderListData(this.searchParams).subscribe(res => {
      this.orderList = res.results;
      this.linkUrl = res.linkUrl;
      this.initPageIndex();
      this.noResultText = '暂无数据';
    }, err => {
      this.initPageIndex();
      this.globalService.httpErrorProcess(err);
    });
  }

  // 变更订单状态
  public onChangeSearchStatus(event: any) {
    const status = event.target.value;
    // this.searchParams.status = null;
    if (status) {
      // this.searchParams.status = Number(status);
    }
  }

  // 变更购买渠道
  public onChangeSearchSource(event: any) {
    const source = event.target.value;
    // this.searchParams.status = null;
    if (source) {
      // this.searchParams.status = Number(status);
    }
  }

  // 条件筛选
  public onSearchBtnClick() {
    if (this.generateAndCheckParamsValid()) {
      this.searchText$.next();
    }
  }

  // 翻页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.orderService.continueOrderListData(this.linkUrl)
        .subscribe(res => {
          this.orderList = this.orderList.concat(res.results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

  // 重置当前页码
  private initPageIndex() {
    this.pageIndex = 1;
  }

  // 下单开始时间的禁用部分
  public disabledOrderStartTime = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.order_end_time) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.order_end_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 下单结束时间的禁用部分
  public disabledOrderEndTime = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.order_start_time) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.order_start_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 支付开始时间的禁用部分
  public disabledStartPayTime = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.pay_end_time) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.pay_end_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 支付结束时间的禁用部分
  public disabledEndPayTime = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.pay_start_time) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.pay_start_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.order_start_time ? (new Date(this.order_start_time).setHours(new Date(this.order_start_time).getHours(),
      new Date(this.order_start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.order_end_time ? (new Date(this.order_end_time).setHours(new Date(this.order_end_time).getHours(),
      new Date(this.order_end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    // this.searchParams.section = `${sTimestamp},${eTimeStamp}`;
    const sPayTimestamp = this.pay_start_time ? (new Date(this.pay_start_time).setHours(new Date(this.pay_start_time).getHours(),
      new Date(this.pay_start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const ePayTimeStamp = this.pay_end_time ? (new Date(this.pay_end_time).setHours(new Date(this.pay_end_time).getHours(),
      new Date(this.pay_end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    // this.searchParams.car_time = this.searchParams.status === '2' ? `${sCheckTimestamp},${eCheckTimeStamp}` : '';
    if (sTimestamp > eTimeStamp) {
      this.globalService.promptBox.open('下单开始时间不能大于结束时间！');
      return false;
    } else if (sPayTimestamp > ePayTimeStamp) {
      this.globalService.promptBox.open('支付开始时间不能大于结束时间！');
      return false;
    }
    return true;
  }
}
