import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../core/global.service';
import { RescueOrderService, RescueOrderEntity, RefundParams, PrepaidOrderEntity, BalanceOrderEntity } from '../rescue-order.service';
import { PromptLoadingComponent } from '../../../share/components/prompt-loading/prompt-loading.component';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpErrorEntity } from '../../../core/http.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit, AfterViewInit {

  public orderRecord: RescueOrderEntity = new RescueOrderEntity();
  public prepaidOrderRecord: PrepaidOrderEntity = new PrepaidOrderEntity();
  public balanceOrderRecord: BalanceOrderEntity = new BalanceOrderEntity();
  public refundParams: RefundParams = new RefundParams(); // 退款参数
  public orderStatus = ['--', '待支付', '已支付', '已取消', '已关闭'];
  public refundStatus = ['--', '退款中', '已部分退款', '已全额退款', '退款失败'];
  private refunding = false;
  private refundOrderType: number;
  private searchText$ = new Subject<any>();
  private order_id: string; // order_id

  @ViewChild(PromptLoadingComponent, { static: true }) public promptLoading: PromptLoadingComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private rescueOrderService: RescueOrderService
  ) {
    this.route.paramMap.subscribe(map => {
      this.order_id = map.get('order_id');
    });
  }

  public ngOnInit() {
    if (this.order_id) {
      this.searchText$.pipe(debounceTime(500)).subscribe(() => {
        this.getOrderDetail();
      });
      this.searchText$.next();
    } else {
      this.router.navigate(['../../list'], { relativeTo: this.route });
    }
  }

  public ngAfterViewInit() {
    this.promptLoading.open(null, true);
  }

  // 获取订单详情
  private getOrderDetail(): void {
    this.rescueOrderService.requestOrderDetailData(this.order_id).subscribe(data => {
      this.orderRecord = data;
      this.prepaidOrderRecord = data.rescue_prepaid_order;
      this.balanceOrderRecord = data.rescue_balance_order;
      this.promptLoading.close();
    }, err => {
      this.promptLoading.close();
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 404) {
          this.globalService.promptBox.open('订单不存在！', null, 2000, null, false);
          return;
        }
      }
    });
  }

  // 退款
  public onRefundClick(order_type: number): void {
    this.refundOrderType = order_type;
    this.refundParams = new RefundParams();
    switch (order_type) {
      case 1:
        this.refundParams.refund_fee = this.prepaidOrderRecord.real_prepaid_fee ? this.prepaidOrderRecord.real_prepaid_fee / 100 : null;
        this.refundParams.refund_reason = this.prepaidOrderRecord.refund_reason || '';
        break;
      case 2:
        this.refundParams.refund_fee = this.balanceOrderRecord.real_balance_fee ? this.balanceOrderRecord.real_balance_fee / 100 : null;
        this.refundParams.refund_reason = this.balanceOrderRecord.refund_reason || '';
    }
    this.refunding = false;
    $('#refundModal').modal('show');
  }

  // 确认退款
  public onRefundCheckClick(): void {
    if (this.refunding) {
      return;
    }
    if (!this.refundParams.refund_fee || Number(this.refundParams.refund_fee) === 0) {
      this.globalService.promptBox.open('退款金额应大于0！', null, 2000, null, false);
      return;
    }
    if (this.refundOrderType === 1) {
      if (Number(this.prepaidOrderRecord.real_prepaid_fee) < Number(this.refundParams.refund_fee) * 100) {
        this.globalService.promptBox.open(`退款金额应小于等于预付实收金额！`, null, 2000, null, false);
        return;
      }

    } else if (this.refundOrderType === 2) {
      if (Number(this.balanceOrderRecord.real_balance_fee) < Number(this.refundParams.refund_fee) * 100) {
        this.globalService.promptBox.open(`退款金额应小于等于尾款实收金额！`, null, 2000, null, false);
        return;
      }
    }
    this.globalService.confirmationBox.open('提示', '操作后将退款金额原路返回至支付账户，此操作不可逆，请慎重操作！', () => {
      this.globalService.confirmationBox.close();
      this.requestRefund();
    }, '确认退款');
  }

  private requestRefund(): void {
    this.refunding = true;
    if (this.refundOrderType === 1) {
      this.requestPrepaidRefund();
    } else if (this.refundOrderType === 2) {
      this.requestBalanceRefund();
    }
  }

  private requestPrepaidRefund(): void {
    this.rescueOrderService.requestPrepaidRefundData(this.refundParams, this.prepaidOrderRecord.rescue_prepaid_order_id).subscribe(() => {
      this.refunding = false;
      $('#refundModal').modal('hide');
      this.globalService.promptBox.open('退款成功');
      this.searchText$.next();
    }, err => {
      this.refunding = false;
      this.refundErrProcess(err);
    });
  }

  private requestBalanceRefund(): void {
    this.rescueOrderService.requestBalanceRefundData(this.refundParams, this.balanceOrderRecord.rescue_balance_order_id).subscribe(() => {
      this.refunding = false;
      $('#refundModal').modal('hide');
      this.globalService.promptBox.open('退款成功');
      this.searchText$.next();
    }, err => {
      this.refunding = false;
      this.refundErrProcess(err);
    });
  }

  private refundErrProcess(err: any): any {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.resource === 'pay_refund' && content.code === 'fail') {
            this.globalService.promptBox.open('退款失败，请重试!', null, 2000, null, false);
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
      this.searchText$.next();
    }
  }
}
