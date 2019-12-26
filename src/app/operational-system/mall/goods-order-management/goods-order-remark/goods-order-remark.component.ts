import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { HttpErrorEntity } from '../../../../core/http.service';
import {
  GoodsOrderEntity,
  GoodsOrderManagementHttpService,
} from '../goods-order-management-http.service';

@Component({
  selector: 'app-goods-order-remark',
  templateUrl: './goods-order-remark.component.html',
  styleUrls: ['./goods-order-remark.component.css']
})
export class GoodsOrderRemarkComponent implements OnInit {

  public currentOrder: GoodsOrderEntity = new GoodsOrderEntity();
  public sureName: string;
  public remark = '';
  public title = '';

  private order_id: string; // 订单id
  private sureCallback: any;
  private closeCallback: any;

  @ViewChild('projectPromptDiv', { static: true }) public projectPromptDiv: ElementRef;

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
   * @param title 标题
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(title: string, orderInfo: GoodsOrderEntity, sureFunc: any, sureName: string = '确定', closeFunc: any = null) {
    const openProjectModal = (data?: any) => {
      timer(0).subscribe(() => {
        $(this.projectPromptDiv.nativeElement).modal('show');
      });
    };
    this.clear();
    this.title = title;
    this.sureName = sureName;
    this.order_id = orderInfo.order_id;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.currentOrder = JSON.parse(JSON.stringify(orderInfo));
    this.remark = (this.title === '备注（平台）' || this.title === '备注') ? this.currentOrder.platform_desc
      : this.title === '备注（商家）' ? this.currentOrder.business_desc : '';
    openProjectModal();
    return;
  }

  private clear() {
    this.remark = '';
    this.currentOrder = new GoodsOrderEntity();
  }

  // form提交
  public onEditFormSubmit() {
    const order_desc = '';
    const platform_desc = (this.title === '备注（平台）' || this.title === '备注') ? this.remark : this.currentOrder.platform_desc;
    const business_desc = this.title === '备注（商家）' ? this.remark : this.currentOrder.business_desc;
    // 修改备注信息
    this.orderHttpService.requestModifyOrderDesc(this.order_id, order_desc, platform_desc, business_desc).subscribe(() => {
      this.onClose();
      this.globalService.promptBox.open('保存成功！', () => {
        this.sureCallbackInfo();
        this.currentOrder = new GoodsOrderEntity();
      });
    }, err => {
      this.errorProcess(err);
    });
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
          const field = content.field === 'platform_desc' ? '平台备注' : content.field === 'business_desc' ? '商家备注' : '';
          if (content.code === 'missing_field') {
            this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, '/assets/images/warning.png');
            return;
          } else if (content.code === 'invalid') {
            this.globalService.promptBox.open(`${field}输入错误`, null, 2000, '/assets/images/warning.png');
          } else {
            this.globalService.promptBox.open('保存失败,请重试!', null, 2000, '/assets/images/warning.png');
          }
        }
      }
    }
  }
}

