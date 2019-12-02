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

  private editParams: EditParams = new EditParams(); // 编辑参数

  private tipMsgList = ['', '保存成功', '提交办理完成', '制贴完成', '发货成功', '驳回成功', '退款成功', '确认收货成功'];

  public logistics_fee: number; // 邮费

  public refund_fee: number; // 退款金额

  public loading = true;

  public imageUrls = [];

  public isEditOrderRemark = false; // 标记是否编辑订单备注
  public isEditRejectRemark = false; // 标记是否编辑驳回备注
  public isEditRefundRemark = false; // 标记是否编辑退款备注

  private order_id: string; // 订单id

  private requestSubscription: Subscription;

  private searchText$ = new Subject<any>();

  @ViewChild(ZPhotoSelectComponent, { static: true }) public ZPhotoSelectComponent: ZPhotoSelectComponent;

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

  /**点击流程处理按钮
   * @param process_flow 2:已提交办理 3:制贴完成 4:发货 5:驳回 6:退款 7:确认收货
   */
  public onChangeProcessStatus(process_flow: number): void {
    if (process_flow === 2) {
      this.globalService.confirmationBox.open('提示', '是否确认已提交办理？', () => {
        this.globalService.confirmationBox.close();
        this.requestChangeProcessFlow(process_flow);
      });
    } else if (process_flow === 3) {
      this.globalService.confirmationBox.open('提示', '请确认已收到此车主的免检贴后再执行此操作哦！', () => {
        this.globalService.confirmationBox.close();
        this.requestChangeProcessFlow(process_flow);
      }, '制贴完成');
    } else if (process_flow === 4) {
      this.editParams = new EditParams();
      this.logistics_fee = null;
      $('#logisticsModal').modal('show');
    } else if (process_flow === 5) {
      this.editParams = new EditParams();
      if (this.orderRecord.reject_remarks) {
        this.editParams.reject_remarks = this.orderRecord.reject_remarks;
      }
      $('#rejectModal').modal('show');
    } else if (process_flow === 6) {
      this.editParams = new EditParams();
      this.refund_fee = null;
      if (this.orderRecord.refund_remarks) {
        this.editParams.refund_remarks = this.orderRecord.refund_remarks;
      }
      $('#refundModal').modal('show');
    } else if (process_flow === 7) {
      this.globalService.confirmationBox.open('提示', '确认收货后无法撤销，确认此操作吗？', () => {
        this.globalService.confirmationBox.close();
        this.requestChangeProcessFlow(process_flow);
      }, '确认收货');
    }
  }

  /**
   * 直接修改办理流程状态
   * @param process_flow 2:提交办理,3:制贴完成,7:确认收货
   */
  private requestChangeProcessFlow(process_flow: number): void {
    const tipMsg = this.tipMsgList[process_flow];
    this.orderService.requestChangeProcessFlowStatus(process_flow, this.order_id).subscribe(() => {
      this.globalService.promptBox.open(tipMsg);
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          this.globalService.promptBox.open('流程办理失败，请重试!', null, 2000, null, false);
          return;
        }
      }
    });
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
      this.closeModal(type);
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

  // 格式化金额
  public onAmountChange(event: any): void {
    const target_value = event.target.value;
    if (target_value) {
      if (isNaN(parseFloat(String(target_value)))) {
        event.target.value = null;
      } else {
        const tmpValue = parseFloat(String(target_value)).toFixed(2);
        event.target.value = parseFloat(tmpValue);
      }
    }
  }

  // 确认发货
  public onSendGoodsClick(): void {
    if (Number(this.logistics_fee) === 0) {
      this.globalService.promptBox.open('邮费应大于0！', null, 2000, null, false);
      return;
    }
    this.editParams.logistics_fee = this.logistics_fee * 100;
    this.editParams.reject_type = null;
    this.requestUpdateOrderDetail(4);
  }

  // 修改驳回原因
  public onChangeRejectType(event: any): void {
    const reject_type = event.target.value;
    this.editParams.reject_type = '';
    this.editParams.reject_notice = null;
    if (reject_type) {
      this.editParams.reject_type = Number(reject_type);
    }
  }

  // 确认驳回
  public onRejectClick(): void {
    this.requestUpdateOrderDetail(5);
  }

  // 确认退款
  public onRefundClick(): void {
    if (Number(this.refund_fee) === 0) {
      this.globalService.promptBox.open('退款金额应大于0！', null, 2000, null, false);
      return;
    }
    const refund_fee = Number(this.refund_fee) * 100;
    if (refund_fee - (this.orderRecord.real_amount) > 0) {
      this.globalService.promptBox.open('退款金额应小于等于实付金额！', null, 2000, null, false);
      return;
    }
    this.editParams.refund_fee = refund_fee;
    this.editParams.reject_type = null;
    this.globalService.confirmationBox.open('提示', '操作后将退款金额原路返回至支付账户，此操作不可逆，请慎重操作！', () => {
      this.globalService.confirmationBox.close();
      this.requestUpdateOrderDetail(6);
    }, '确认退款');
  }

  // 关闭模态框
  private closeModal(type: number): void {
    if (type === 4) {
      $('#logisticsModal').modal('hide');
    } else if (type === 5) {
      $('#rejectModal').modal('hide');
    } else if (type === 6) {
      $('#refundModal').modal('hide');
    }
  }

  /**
   * 打开放大图片组件
   */
  public onOpenZoomPictureModal(image_url: string) {
    const openIndex = this.imageUrls.findIndex(imageItem => imageItem === image_url);
    timer(0).subscribe(() => {
      this.ZPhotoSelectComponent.zoomPicture(openIndex);
    });
  }

  // 打包下载
  public onDownloadClick(): void {
    const downloadUrl = `${environment.EXEMPTION_DOMAIN}/exemption/download/orders/${this.order_id}`;
    window.open(downloadUrl);
  }
}
