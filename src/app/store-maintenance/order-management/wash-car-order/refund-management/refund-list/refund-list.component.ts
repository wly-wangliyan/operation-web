import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  WashCarOrderEntity,
  WashCarRefundParams,
  WashCarSearchParams,
  WashOrderService
} from '../../wash-car-order.service';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { CheckRefundComponent } from '../../check-refund/check-refund.component';
import { GlobalConst } from '../../../../../share/global-const';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { RefundManagementService, WashCarRefundSearchParams } from '../refund-management.service';

@Component({
  selector: 'app-refund-list',
  templateUrl: './refund-list.component.html',
  styleUrls: ['./refund-list.component.css']
})
export class RefundListComponent implements OnInit, OnDestroy {

  public orderList: Array<WashCarOrderEntity> = []; // 洗车订单
  public searchParams: WashCarRefundSearchParams = new WashCarRefundSearchParams(); // 洗车订单
  public refundParams: WashCarRefundParams = new WashCarRefundParams(); // 退款
  public carTypes = [1, 2]; // 车型
  public order_start_time: any = ''; // 下单开始时间
  public order_end_time: any = ''; // 下单结束时间
  public pay_start_time: any = ''; // 支付开始时间
  public pay_end_time: any = ''; // 支付结束时间

  public pageIndex = 1; // 当前页码
  public noResultText = '数据加载中...';
  private requestSubscription: Subscription; // 获取数据
  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription; // 分页获取数据
  private linkUrl: string; // 分页url
  private selectOrder: WashCarOrderEntity = new WashCarOrderEntity(); // 选中行

  @ViewChild(CheckRefundComponent, {static: true}) public checkRefundComponent: CheckRefundComponent;

  private get pageCount(): number {
    if (this.orderList.length % GlobalConst.NzPageSize === 0) {
      return this.orderList.length / GlobalConst.NzPageSize;
    }
    return this.orderList.length / GlobalConst.NzPageSize + 1;
  }

  constructor(
      private globalService: GlobalService,
      private refundService: RefundManagementService) { }

  public ngOnInit() {
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
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
    this.requestSubscription = this.refundService.requestOrderRefundList(this.searchParams)
        .subscribe(result => {
          this.orderList = result.results;
          this.linkUrl = result.linkUrl;
          this.pageIndex = 1;
          this.noResultText = '暂无数据';
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
      this.continueRequestSubscription = this.refundService.continueOrderRefundList(this.linkUrl)
          .subscribe(continueData => {
            const results = continueData.results;
            this.orderList = this.orderList.concat(results);
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
  public onExportRecords(type: string): void {
    if (this.generateAndCheckParamsValid()) {
      let searchUrl = `${environment.STORE_DOMAIN}/admin/wash_car_orders/export?default=1`;
      const params = this.searchParams.json();
      if (type === 'all') {
        delete params.page_size;
        delete params.page_num;
      } else {
        params.page_size = 15;
      }
      for (const key in params) {
        if (params[key]) {
          searchUrl += `&${key}=${params[key]}`;
        }
      }
      window.open(searchUrl);
    }
  }

  /* 生成并检查参数有效性 */
  private generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.order_start_time ? (new Date(this.order_start_time).setHours(new Date(this.order_start_time).getHours(),
        new Date(this.order_start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.order_end_time ? (new Date(this.order_end_time).setHours(new Date(this.order_end_time).getHours(),
        new Date(this.order_end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    if (sTimestamp > eTimeStamp) {
      this.globalService.promptBox.open('申请开始时间不能大于结束时间！', null, 2000, null, false);
      return false;
    }
    if (this.order_start_time || this.order_end_time) {
      this.searchParams.apply_section = `${sTimestamp},${eTimeStamp}`;
    } else {
      this.searchParams.apply_section = null;
    }
    return true;
  }

  // 审核并退款
  public onCheckRefundClick(orderItem: WashCarOrderEntity): void {
    this.selectOrder = orderItem;
    this.checkRefundComponent.open(orderItem, () => {
      this.searchText$.next();
    });
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
