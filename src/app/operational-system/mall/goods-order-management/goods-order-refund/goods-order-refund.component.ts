import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { HttpErrorEntity } from '../../../../core/http.service';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import {
  GoodsOrderEntity,
  GoodsOrderManagementHttpService,
} from '../goods-order-management-http.service';

@Component({
  selector: 'app-goods-order-refund',
  templateUrl: './goods-order-refund.component.html',
  styleUrls: ['./goods-order-refund.component.css']
})
export class GoodsOrderRefundComponent implements OnInit {

  public currentOrder: GoodsOrderEntity = new GoodsOrderEntity();
  public isShowErrMes = false; // 错误信息
  public sureName: string;
  public refund_price: string;
  public realPrice: number;
  public remark = '';

  private order_id: string; // 订单id
  private sureCallback: any;
  private closeCallback: any;

  @ViewChild('projectPromptDiv', { static: true }) public projectPromptDiv: ElementRef;
  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;

  constructor(private orderHttpService: GoodsOrderManagementHttpService,
              private globalService: GlobalService) {
  }

  public ngOnInit(): void {
  }

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      this.onEditFormSubmit();
      return false;
    }
  }

  // 弹框close
  public onClose() {
    $(this.projectPromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(orderInfo: GoodsOrderEntity, sureFunc: any, sureName: string = '确定', closeFunc: any = null) {
    const openProjectModal = (data?: any) => {
      timer(0).subscribe(() => {
        $(this.projectPromptDiv.nativeElement).modal('show');
      });
    };
    this.clear();
    this.sureName = sureName;
    this.order_id = orderInfo.order_id;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.currentOrder = JSON.parse(JSON.stringify(orderInfo));
    this.realPrice = this.currentOrder.real_price;
    openProjectModal();
    return;
  }

  private clear() {
    this.refund_price = '';
    this.remark = '';
    this.isShowErrMes = false;
    this.currentOrder = new GoodsOrderEntity();
  }

  // form提交
  public onEditFormSubmit() {
    if (Number(this.refund_price) * 100 > Number(this.realPrice)) {
      this.isShowErrMes = true;
    } else {
      this.isShowErrMes = false;
      this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认退款？', () => {
        this.globalService.confirmationBox.close();
        // 修改邮费信息
        this.orderHttpService.requestModifyOrderDelivery(this.order_id, this.currentOrder).subscribe(() => {
          this.onClose();
          this.globalService.promptBox.open('保存成功！', () => {
            this.sureCallbackInfo();
            this.currentOrder = new GoodsOrderEntity();
          });
        }, err => {
          this.errorProcess(err);
        });
      });

    }
  }

  // 确定按钮回调
  private sureCallbackInfo() {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.closeCallback = null;
      this.sureCallback = null;
      temp();
    }
  }

  // 接口错误状态
  private errorProcess(err) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);

        for (const content of error.errors) {
          if (content.field === 'version' && content.code === 'invalid') {
            return;
          } else if (content.field === 'version' && content.code === 'version exists') {
            return;
          }
        }
      }
    }
  }

  // 限制input[type='number']输入e
  public inputNumberLimit(event: any): boolean {
    const reg = /^\d*?\.?\d*?$/;
    const keyCode = String.fromCharCode(event.keyCode);
    return (keyCode && reg.test(keyCode));
  }
}

