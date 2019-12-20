import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { HttpErrorEntity } from '../../../../core/http.service';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import {
  GoodsOrderEntity,
  GoodsOrderManagementHttpService,
  ModifyOrderParams
} from '../goods-order-management-http.service';

@Component({
  selector: 'app-goods-order-delivery',
  templateUrl: './goods-order-delivery.component.html',
  styleUrls: ['./goods-order-delivery.component.css']
})
export class GoodsOrderDeliveryComponent implements OnInit {

  public currentOrder: ModifyOrderParams = new ModifyOrderParams();
  public errMes = ''; // 错误信息
  public postage = 0;
  public sureName: string;
  public radioValue: string;
  public deliveryCompany: Array<any> = [];

  private order_id: string; // 订单id
  private sureCallback: any;
  private closeCallback: any;

  @ViewChild('projectPromptDiv', { static: true }) public projectPromptDiv: ElementRef;
  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;

  constructor(private orderHttpService: GoodsOrderManagementHttpService,
              private globalService: GlobalService) {
  }

  public ngOnInit(): void {
    this.currentOrder.is_delivery = 1;
    this.deliveryCompany = [
      { key: '顺丰速运', value: '顺丰速运' },
      { key: '圆通速递', value: '圆通速递' },
      { key: '申通快递', value: '申通快递' },
      { key: '中通快递', value: '中通快递' },
      { key: '百世快递', value: '百世快递' },
      { key: '韵达快递', value: '韵达快递' },
      { key: '天天快递', value: '天天快递' },
      { key: '中国邮政', value: '中国邮政' },
      { key: 'EMS', value: 'EMS' },
      { key: '宅急送', value: '宅急送' },
      { key: '德邦物流', value: '德邦物流' },
      { key: '京东快递', value: '京东快递' },
      { key: '特急送', value: '特急送' },
    ];
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
    this.postage = this.currentOrder.postage || this.currentOrder.postage === 0 ? Number((this.currentOrder.postage / 100).toFixed(2)) : null;
    openProjectModal();
    return;
  }

  private clear() {
    this.errMes = '';
    this.currentOrder = new ModifyOrderParams();
  }

  // form提交
  public onEditFormSubmit() {
    if (Number(this.postage) >= 10000) {
      this.errMes = '邮费金额应小于10000元！';
      return;
    } else {
      this.currentOrder.postage = this.postage * 100;
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
    // const reg = /[\d]/;
    const reg = /^\d*?\.?\d*?$/;
    const keyCode = String.fromCharCode(event.keyCode);
    return (keyCode && reg.test(keyCode));
  }

  // 格式化金额
  public onAmountChange(event: any): void {
    if (event.target.value) {
      if (isNaN(parseFloat(String(event.target.value)))) {
        event.target.value = null;
      } else {
        const amount = parseFloat(String(event.target.value)).toFixed(2);
        event.target.value = parseFloat(amount);
      }
    }
  }
}
