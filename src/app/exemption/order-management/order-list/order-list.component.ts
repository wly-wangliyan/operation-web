import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, Subject, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';
import { GlobalService } from '../../../core/global.service';
import { OrderManagementService, OrderSearchParams, ExemptionOrderEntity } from '../order-management.service';
import { ZPhotoSelectComponent } from '../../../share/components/z-photo-select/z-photo-select.component';
import { environment } from '../../../../environments/environment';

const PageSize = 15;

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
  public searchParams: OrderSearchParams = new OrderSearchParams(); // 条件筛选
  public orderList: Array<ExemptionOrderEntity> = []; // 产品订单列表
  public order_status: any = ''; // 订单状态
  public processing_flow: any = ''; // 办理流程
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

  private get pageCount(): number {
    if (this.orderList.length % PageSize === 0) {
      return this.orderList.length / PageSize;
    }
    return this.orderList.length / PageSize + 1;
  }

  @ViewChild(ZPhotoSelectComponent, { static: true }) public ZPhotoSelectComponent: ZPhotoSelectComponent;

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
      this.orderList.forEach(item => {
        let urls = item.driving_license_front ? item.driving_license_front : '';
        urls = urls + (item.driving_license_side ? (',' + item.driving_license_side) : '');
        urls = urls + (item.car_image ? (',' + item.car_image) : '');
        urls = urls + (item.insurance_policy ? (',' + item.insurance_policy) : '');
        urls = urls + (item.payment_certificate ? (',' + item.payment_certificate) : '');
        urls = urls + (item.signature_image ? (',' + item.signature_image) : '');
        item.imageUrls = urls ? urls.split(',') : [];
      });
      this.linkUrl = res.linkUrl;
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
      this.continueRequestSubscription = this.orderService.continueOrderListData(this.linkUrl)
        .subscribe(res => {
          const results = res.results;
          results.forEach(item => {
            let urls = item.driving_license_front ? item.driving_license_front : '';
            urls = urls + (item.driving_license_side ? (',' + item.driving_license_side) : '');
            urls = urls + (item.insurance_policy ? (',' + item.insurance_policy) : '');
            urls = urls + (item.payment_certificate ? (',' + item.payment_certificate) : '');
            item.imageUrls = urls ? urls.split(',') : [];
          });
          this.orderList = this.orderList.concat(results);
          this.linkUrl = res.linkUrl;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    }
  }

  // 改变订单状态
  public onChangeOrderStatus(event: any): void {
    const status = event.target.value;
    this.searchParams.status = null;
    if (status) {
      this.searchParams.status = Number(status);
    }
  }

  // 改变办理流程
  public onChangeProcessStatus(event: any): void {
    const status = event.target.value;
    this.searchParams.processing_flow = null;
    if (status) {
      this.searchParams.processing_flow = Number(status);
    }
  }

  // 条件查询
  public onSearchBtnClick(): void {
    if (this.generateAndCheckParamsValid()) {
      this.searchText$.next();
    }
  }

  /**
   * 打开放大图片组件
   */
  public onOpenZoomPictureModal(orderRecord: ExemptionOrderEntity, openIndex: number) {
    this.imageUrls = orderRecord.imageUrls ? orderRecord.imageUrls : [];
    timer(0).subscribe(() => {
      this.ZPhotoSelectComponent.zoomPicture(openIndex);
    });
  }

  /**
   * 订单隐藏、显示
   * hidden 1:隐藏 2:显示
   * */
  public onHiddenClick(order_id: string, status: number) {
    const tip = status === 1 ? '隐藏' : '显示';
    this.orderService.requestOrderHidden(order_id, status).subscribe(() => {
      this.globalService.promptBox.open(tip + '成功！');
      this.searchText$.next();
    }, err => {
      this.globalService.promptBox.open(tip + '失败！', null, 2000, null, false);
    });
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
      this.globalService.promptBox.open('下单开始时间不能大于结束时间！', null, 2000, null, false);
      return false;
    } else if (sPayTimestamp > ePayTimeStamp) {
      this.globalService.promptBox.open('支付开始时间不能大于结束时间！', null, 2000, null, false);
      return false;
    }
    if (this.order_start_time || this.order_end_time) {
      this.searchParams.created_section = `${sTimestamp},${eTimeStamp}`;
    } else {
      this.searchParams.created_section = null;
    }

    if (this.pay_start_time || this.pay_end_time) {
      this.searchParams.pay_section = `${sPayTimestamp},${ePayTimeStamp}`;
    } else {
      this.searchParams.pay_section = null;
    }
    return true;
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
