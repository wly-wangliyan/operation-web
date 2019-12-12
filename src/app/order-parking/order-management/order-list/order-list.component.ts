import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, Subject, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';
import { GlobalService } from '../../../core/global.service';
import { OrderManagementService, BookingOrderEntity, OrderSearchParams } from '../order-management.service';
import { ZPhotoSelectComponent } from '../../../share/components/z-photo-select/z-photo-select.component';
import { environment } from '../../../../environments/environment';
import { HttpErrorEntity } from '../../../core/http.service';

const PageSize = 15;

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
  public searchParams: OrderSearchParams = new OrderSearchParams(); // 条件筛选
  public orderList: Array<BookingOrderEntity> = []; // 产品订单列表
  public order_start_time: any = ''; // 下单开始时间
  public order_end_time: any = ''; // 下单结束时间
  public pay_start_time: any = ''; // 支付开始时间
  public pay_end_time: any = ''; // 支付结束时间

  public pageIndex = 1; // 当前页码
  public noResultText = '数据加载中...';

  public imageUrls = []; // 图片放大集合

  private requestSubscription: Subscription; // 获取数据
  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription; // 分页获取数据
  private linkUrl: string; // 分页url
  private searchUrl: string;

  private get pageCount(): number {
    if (this.orderList.length % PageSize === 0) {
      return this.orderList.length / PageSize;
    }
    return this.orderList.length / PageSize + 1;
  }

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

  // 初始化获取订单列表
  private generateOrderList() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestOrderList();
    });
    this.searchText$.next();
  }

  // 请求订单列表
  private requestOrderList() {
    this.orderService.requestOrderListData(this.searchParams).subscribe(res => {
      this.orderList = res.results;
      this.linkUrl = res.linkUrl;
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
      this.continueRequestSubscription = this.orderService.continueOrderListData(this.linkUrl)
        .subscribe(res => {
          const results = res.results;
          results.forEach(item => {
            let urls = item.driving_license_front ? item.driving_license_front : '';
            urls = urls + (item.driving_license_side ? (',' + item.driving_license_side) : urls);
            urls = urls + (item.insurance_policy ? (',' + item.insurance_policy) : urls);
            urls = urls + (item.payment_certificate ? (',' + item.payment_certificate) : urls);
            item.imageUrls = urls ? urls.split(',') : [];
          });
          this.orderList = this.orderList.concat(results);
          this.linkUrl = res.linkUrl;
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

  /* 生成并检查参数有效性 */
  private generateAndCheckParamsValid(): boolean {
    const sTimestamp = this.order_start_time ? (new Date(this.order_start_time).setHours(new Date(this.order_start_time).getHours(),
      new Date(this.order_start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.order_end_time ? (new Date(this.order_end_time).setHours(new Date(this.order_end_time).getHours(),
      new Date(this.order_end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    const sPayTimestamp = this.pay_start_time ? (new Date(this.pay_start_time).setHours(new Date(this.pay_start_time).getHours(),
      new Date(this.pay_start_time).getMinutes(), 0, 0) / 1000).toString() : 0;
    const ePayTimeStamp = this.pay_end_time ? (new Date(this.pay_end_time).setHours(new Date(this.pay_end_time).getHours(),
      new Date(this.pay_end_time).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    if (sTimestamp > eTimeStamp) {
      this.globalService.promptBox.open('下单开始时间不能大于结束时间！');
      return false;
    } else if (sPayTimestamp > ePayTimeStamp) {
      this.globalService.promptBox.open('支付开始时间不能大于结束时间！');
      return false;
    }
    if (this.order_start_time || this.order_end_time) {
      this.searchParams.order_time = `${sTimestamp},${eTimeStamp}`;
    } else {
      this.searchParams.order_time = null;
    }

    if (this.pay_start_time || this.pay_end_time) {
      this.searchParams.pay_time = `${sPayTimestamp},${ePayTimeStamp}`;
    } else {
      this.searchParams.pay_time = null;
    }
    return true;
  }

  // 退款
  public onRefundClick(data: BookingOrderEntity) {
    this.globalService.confirmationBox.open('提示', `确认退款给${data.car_id}车主？`, () => {
      this.globalService.confirmationBox.close();
      const params = {order_id: data.order_id, refund_fee: data.real_fee};
      this.orderService.requestCreateRefundOrder(params).subscribe(res => {
        this.orderService.requestOrderRefund(res.body.refund_order_id).subscribe(res1 => {
          this.globalService.promptBox.open('退款成功！');
        }, err => {
          this.errorProcess(err);
        });
      }, error => {
        this.errorProcess(error);
      });
    });
  }

  private errorProcess(err) {
    if (err.status === 422) {
      const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
      for (const content of error.errors) {
        if (content.code === 'invalid' && content.field === 'refund_fee') {
          this.globalService.promptBox.open('退款金额错误或无效！', null, 2000, null, false);
          return;
        } else if (content.code === 'not_allow' && content.resource === 'order') {
          this.globalService.promptBox.open('该订单不允许退款！', null, 2000, null, false);
          return;
        } else if (content.code === 'failure' && content.resource === 'pay_refund') {
          this.globalService.promptBox.open('退款失败！', null, 2000, null, false);
          return;
        }
      }
    } else {
      this.globalService.httpErrorProcess(err);
    }
  }

  // 导出url
  private exportSearchUrl() {
    // tslint:disable-next-line:max-line-length
    this.searchUrl = `${environment.BOOKING_DOMAIN}/admin/orders/export?order_status=${this.searchParams.order_status}&buyer_tel=${this.searchParams.buyer_tel}&buyer_name=${this.searchParams.buyer_name}&order_id=${this.searchParams.order_id}&order_time=${this.searchParams.order_time || ''}&pay_time=${this.searchParams.pay_time || ''}`;
  }

  // 导出订单列表
  public onExportClick() {
    if (this.generateAndCheckParamsValid() && this.searchUrl) {
      window.open(this.searchUrl);
    } else {
      return;
    }
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
}
