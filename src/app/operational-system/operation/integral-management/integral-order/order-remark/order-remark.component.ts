import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { GlobalService } from '../../../../../core/global.service';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { IntegralOrderEntity, IntegralOrderHttpService } from '../integral-order-http.service';

@Component({
  selector: 'app-order-remark',
  templateUrl: './order-remark.component.html',
  styleUrls: ['./order-remark.component.css']
})
export class OrderRemarkComponent implements OnInit {

  public sureName: string;
  public remark = '';
  public title = '';

  public integral_order_id: string; // 订单id
  private sureCallback: any;

  @ViewChild('remarkPromptDiv', { static: true }) public remarkPromptDiv: ElementRef;

  constructor(
    private orderHttpService: IntegralOrderHttpService,
    private globalService: GlobalService) {
  }

  public ngOnInit(): void {
  }

  // 弹框close
  public onClose() {
    $(this.remarkPromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param title 标题
   * @param orderInfo {IntegralOrderEntity} 订单详情
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   */
  public open(title: string, orderInfo: IntegralOrderEntity, sureFunc: any, sureName: string = '确定') {
    const openModal = () => {
      timer(0).subscribe(() => {
        $(this.remarkPromptDiv.nativeElement).modal('show');
      });
    };
    this.clear();
    this.title = title;
    this.sureName = sureName;
    this.integral_order_id = orderInfo.integral_order_id;
    this.sureCallback = sureFunc;
    this.remark = orderInfo.order_remark;
    openModal();
    return;
  }

  private clear() {
    this.remark = '';
  }

  // form提交
  public onEditFormSubmit() {
    // 修改备注信息
    this.orderHttpService.requestModifyOrderRemark(this.integral_order_id, this.remark).subscribe(() => {
      this.onClose();
      this.globalService.promptBox.open('保存成功！', () => {
        this.sureCallbackInfo();
      });
    }, err => {
      this.errorProcess(err);
    });
  }

  // 确定按钮回调
  private sureCallbackInfo() {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.sureCallback = null;
      temp();
    }
  }

  // 接口错误状态
  private errorProcess(err: any): any {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          const field = content.field === 'remark' ? '平台备注' : content.field === 'buyer_remark' ? '买家备注' : '';
          if (content.code === 'missing_field') {
            this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, null, false);
            return;
          } else if (content.code === 'invalid') {
            this.globalService.promptBox.open(`${field}输入错误!`, null, 2000, null, false);
          } else {
            this.globalService.promptBox.open('保存失败,请重试!', null, 2000, null, false);
          }
        }
      }
    }
  }
}

