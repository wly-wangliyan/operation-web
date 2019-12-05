import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, Subject, timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { GlobalService } from '../../../core/global.service';
import { OrderManagementService, ExemptionOrderEntity, EditParams } from '../order-management.service';
import { environment } from '../../../../environments/environment';
import { ZPhotoSelectComponent } from '../../../share/components/z-photo-select/z-photo-select.component';
import { HttpErrorEntity } from 'src/app/core/http.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  public orderRecord: ExemptionOrderEntity = new ExemptionOrderEntity();

  public editParams: EditParams = new EditParams(); // 编辑参数

  private tipMsgList = ['', '保存成功', '提交办理完成', '制贴完成', '发货成功', '驳回成功', '退款成功', '确认收货成功'];

  public logistics_fee: number; // 邮费

  public refund_fee: number; // 退款金额

  public loading = true;

  public imageUrls = [];

  public isEditOrderRemark = false; // 标记是否编辑订单备注
  public isEditRejectRemark = false; // 标记是否编辑驳回备注
  public isEditRefundRemark = false; // 标记是否编辑退款备注

  private order_id: string; // 订单id

  private searchText$ = new Subject<any>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService, private orderService: OrderManagementService) {
    this.route.paramMap.subscribe(map => {
      this.order_id = map.get('order_id');
    });
  }

  public ngOnInit() {
    if (this.order_id) {
      this.searchText$.pipe(debounceTime(500)).subscribe(() => {
        this.requestOrderDetail();
      });
      this.searchText$.next();
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  // 获取免检订单详情
  private requestOrderDetail(): void {
    this.orderService.requestOrderDetailData(this.order_id).subscribe(data => {
      this.orderRecord = data;
      this.generateImageUrls();
      this.loading = false;
    }, err => {
      this.loading = false;
      this.globalService.httpErrorProcess(err);
    });
  }

  /**编辑
   * @param type 1:订单备注 5:驳回备注 6:退款备注
   */
  public onEditClick(type: number) {
    if (type === 1) {
      this.isEditOrderRemark = true;
    } else if (type === 5) {
      this.isEditRejectRemark = true;
    } else if (type === 6) {
      this.isEditRefundRemark = true;
    }
  }

  /**保存
   * @param type 1:订单备注 5:驳回备注 6:退款备注
   */
  public onSaveClick(type: number) {
    this.editParams = new EditParams();
    if (type === 1) {
      this.editParams.order_remarks = this.orderRecord.order_remarks;
    } else if (type === 5) {
      this.editParams.reject_remarks = this.orderRecord.reject_remarks;
    } else if (type === 6) {
      this.editParams.refund_remarks = this.orderRecord.refund_remarks;
    }
    this.requestUpdateOrderDetail(type, true);
  }

  /**取消编辑
   * @param type 1:订单备注 5:驳回备注 6:退款备注
   */
  public onCancleClick(type: number) {
    if (type === 1) {
      this.isEditOrderRemark = false;
    } else if (type === 5) {
      this.isEditRejectRemark = false;
    } else if (type === 6) {
      this.isEditRefundRemark = false;
    }
    this.searchText$.next();
  }

  // 格式化放大图片集合
  private generateImageUrls() {
    this.imageUrls = [];
    // 行驶证正本
    if (this.orderRecord.driving_license_front) {
      this.imageUrls.push(this.orderRecord.driving_license_front);
    }
    // 行驶证副本
    if (this.orderRecord.driving_license_side) {
      this.imageUrls.push(this.orderRecord.driving_license_side);
    }
    // 交强险保单
    if (this.orderRecord.insurance_policy) {
      this.imageUrls.push(this.orderRecord.insurance_policy);
    }
    // 车船税纳税凭证
    if (this.orderRecord.payment_certificate) {
      this.imageUrls.push(this.orderRecord.payment_certificate);
    }
  }

  /** 修改订单详情
   * @param type 1:修改订单备注 4:发货 5:驳回或修改驳回备注 6:退款或修改退款备注
   * @param isEditRemark true 只修改备注 false 办理流程操作
   */
  private requestUpdateOrderDetail(type: number, isEditRemark: boolean = false): void {
    let tipMsg = this.tipMsgList[1];
    if (!isEditRemark) {
      tipMsg = this.tipMsgList[type];
    }
    this.orderService.requestUpdateOrderDetailData(this.editParams, this.order_id).subscribe(() => {
      this.globalService.promptBox.open(tipMsg);
      this.onCancleClick(type);
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.code === 'failed' && content.field === 'refund') {
              this.globalService.promptBox.open('退款失败，请重试!', null, 2000, null, false);
              return;
            } else {
              this.globalService.promptBox.open('保存失败，请重试!', null, 2000, null, false);
              return;
            }
          }
        }
      }
    });
  }

  // 限制input[type='number']输入e
  public inputNumberLimit(event: any): boolean {
    const reg = /^\d*?\.?\d*?$/;
    const keyCode = String.fromCharCode(event.keyCode);
    return (keyCode && reg.test(keyCode));
  }

  // 重新发送短信
  public onResendMessage() {
    /*this.orderService.requestResendMessage(this.order_id).subscribe(res => {
      this.globalService.promptBox.open('短信重发成功！');
      this.getOrderDetail();
    }, err => {
      this.globalService.promptBox.open('短信重发失败，请稍后再试！', null, 2000, '/assets/images/warning.png');
    });*/
  }
}
