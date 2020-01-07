import { Component, OnInit, OnDestroy } from '@angular/core';
import { WashOrderService, WashCarOrderEntity, WashCarSearchParams, WashCarRefundParams } from '../wash-car-order.service';
import { DisabledTimeHelper } from '../../../../../utils/disabled-time-helper';
import { GlobalService } from '../../../../core/global.service';
import { Subscription, Subject } from 'rxjs';
import { GlobalConst } from '../../../../share/global-const';
import { debounceTime } from 'rxjs/operators';
import { WashCarEntity } from 'src/app/store-maintenance/garage-management/garage-management.service';
import { HttpErrorEntity } from '../../../../core/http.service';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
  public orderList: Array<WashCarOrderEntity> = []; // 洗车订单
  public searchParams: WashCarSearchParams = new WashCarSearchParams(); // 洗车订单
  public refundParams: WashCarRefundParams = new WashCarRefundParams(); // 退款
  public orderStatus = [1, 2, 3, 4, 5, 6];

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
  private operationing = false;

  private get pageCount(): number {
    if (this.orderList.length % GlobalConst.NzPageSize === 0) {
      return this.orderList.length / GlobalConst.NzPageSize;
    }
    return this.orderList.length / GlobalConst.NzPageSize + 1;
  }

  constructor(
    private globalService: GlobalService,
    private orderService: WashOrderService) { }

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
    this.requestSubscription = this.orderService.requestOrderListData(this.searchParams).subscribe(res => {
      this.orderList = res.results;
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
      this.searchParams.order_section = `${sTimestamp},${eTimeStamp}`;
    } else {
      this.searchParams.order_section = null;
    }

    if (this.pay_start_time || this.pay_end_time) {
      this.searchParams.pay_section = `${sPayTimestamp},${ePayTimeStamp}`;
    } else {
      this.searchParams.pay_section = null;
    }
    return true;
  }

  public onRefundClick(orderItem: WashCarOrderEntity): void {
    this.selectOrder = orderItem;
    this.refundParams = new WashCarRefundParams();
    this.refundParams.refund_fee = orderItem.sale_fee ? orderItem.sale_fee / 100 : null;
    this.operationing = false;
    $('#refundModal').modal('show');
  }

  // 确认退款
  public onRefundCheckClick(): void {
    if (this.operationing) {
      return;
    }
    if (!this.refundParams.refund_fee || Number(this.refundParams.refund_fee) === 0) {
      this.globalService.promptBox.open('退款金额应大于0！', null, 2000, null, false);
      return;
    }

    if (Number(this.selectOrder.sale_fee) < Number(this.refundParams.refund_fee) * 100) {
      this.globalService.promptBox.open(`退款金额应小于等于实收金额！`, null, 2000, null, false);
      return;
    }

    this.globalService.confirmationBox.open('提示', '操作后将退款金额原路返回至支付账户，此操作不可逆，请慎重操作！', () => {
      this.globalService.confirmationBox.close();
      this.requestRefund();
    }, '确认退款');
  }

  private requestRefund(): void {
    this.operationing = true;
    this.orderService.requestOrderRefundData(this.selectOrder.wash_car_order_id,
      this.refundParams).subscribe(() => {
        this.operationing = false;
        $('#refundModal').modal('hide');
        this.globalService.promptBox.open('退款成功');
        this.searchText$.next();
      }, err => {
        this.operationing = false;
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 422) {
            const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
            for (const content of error.errors) {
              if (content.field === 'refund_fee' && content.code === 'invalid') {
                this.globalService.promptBox.open('退款金额错误，请重新输入!', null, 2000, null, false);
                return;
              } else if (content.resource === 'order' && content.code === 'not_allow') {
                this.globalService.promptBox.open('退款失败，请重试!', null, 2000, null, false);
                return;
              } else {
                this.globalService.promptBox.open('退款失败，请重试!', null, 2000, null, false);
                return;
              }
            }
          }
        }
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

  // 支付开始时间的禁用部分
  public disabledStartPayTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(startValue, this.pay_start_time);
  }

  // 支付结束时间的禁用部分
  public disabledEndPayTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledStartTime(endValue, this.pay_end_time);
  }
}
