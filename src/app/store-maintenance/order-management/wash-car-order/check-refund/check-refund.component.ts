import { Component, OnInit } from '@angular/core';
import { RefundManagementService, WashCarCheckRefundParams } from '../refund-management/refund-management.service';
import { GlobalService } from '../../../../core/global.service';
import { timer } from 'rxjs';
import { WashRefundEntity } from '../wash-car-order.service';

@Component({
  selector: 'app-check-refund',
  templateUrl: './check-refund.component.html',
  styleUrls: ['./check-refund.component.css']
})
export class CheckRefundComponent implements OnInit {

  public refundCheckParams: WashCarCheckRefundParams = new WashCarCheckRefundParams(); // 退款
  public selectOrder = { ...new WashRefundEntity(), sale_fee: null }; // 选中行

  private operationing = false;
  private sureCallback: any;
  private refund_fee: number; // 应退金额

  constructor(
    private globalService: GlobalService,
    private refundService: RefundManagementService) { }

  ngOnInit() {
  }

  public open(data: any, sureFunc: any) {
    this.operationing = false;
    this.selectOrder = data;
    this.refundCheckParams.refund_fee = data.refund_fee ? data.refund_fee / 100 : null;
    this.sureCallback = sureFunc;
    this.refund_fee = null;
    timer(0).subscribe(() => {
      $('#checRrefundModal').modal('show');
    });
  }

  // 确认退款
  public onRefundCheckClick(): void {
    if (this.operationing) {
      return;
    }
    this.refundCheckParams.apply_status = 2;
    const refund_fee = this.refundCheckParams.refund_fee;
    if (!refund_fee || Number(refund_fee) === 0) {
      this.globalService.promptBox.open('退款金额应大于0！', null, 2000, null, false);
      return;
    }
    const sale_fee = this.selectOrder.sale_fee ? this.selectOrder.sale_fee : this.selectOrder.wash_car_order.sale_fee ?
      this.selectOrder.wash_car_order.sale_fee : 0;
    if (Number(sale_fee) < Math.round(Number(refund_fee) * 100)) {
      this.globalService.promptBox.open(`退款金额应小于等于实收金额！`, null, 2000, null, false);
      return;
    } else if (this.refund_fee && Number(this.refund_fee) < Math.round(Number(refund_fee) * 100)) {
      this.globalService.promptBox.open(`退款金额与申请不一致，应退金额${this.refund_fee / 100}元!`, null, 2000, null, false);
      return;
    }

    this.globalService.confirmationBox.open('提示', '操作后将退款金额原路返回至支付账户，确定操作退款吗？', () => {
      this.globalService.confirmationBox.close();
      this.requestRefund();
    }, '确认退款');
  }

  // 拒绝申请
  public onRefuseRefundClick(): void {
    if (this.operationing) {
      return;
    }
    this.refundCheckParams.apply_status = 3;
    this.requestRefund('refuse');
  }

  private requestRefund(type?: string): void {
    this.operationing = true;
    const errMsg = type === 'refuse' ? '拒绝申请失败，请重试!' : '退款失败，请重试!';
    const successMsg = type === 'refuse' ? '拒绝申请成功!' : '退款成功!';
    const errfunc = (err) => {
      this.operationing = false;
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          // const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          const error = err.error;
          for (const content of error.errors) {
            this.refund_fee = content.refund_fee;
            if (content.field === 'refund_fee' && content.code === 'invalid') {
              this.globalService.promptBox.open('退款金额错误，请重新输入!', null, 2000, null, false);
              return;
            } else if (content.resource === 'order' && content.code === 'not_allow') {
              this.globalService.promptBox.open(errMsg, null, 2000, null, false);
              return;
            } else if (content.resource === 'apply_fee' && content.code === 'already_changed') {
              this.globalService.promptBox.open(`退款金额与申请不一致，应退金额${this.refund_fee / 100}元!`, null, 2000, null, false);
              return;
            } else {
              this.globalService.promptBox.open(errMsg, null, 2000, null, false);
              return;
            }
          }
        }
      }
    };
    const successFunc = () => {
      this.operationing = false;
      $('#checRrefundModal').modal('hide');
      this.globalService.promptBox.open(successMsg);
      this.sureCallback();
    };
    this.refundService.requestOrderRefundData(this.selectOrder.refund_application_id,
      this.refundCheckParams).subscribe(() => {
        successFunc();
      }, err => {
        errfunc(err);
      });
  }

}
