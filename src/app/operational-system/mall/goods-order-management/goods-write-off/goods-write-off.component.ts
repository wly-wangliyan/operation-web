import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Subject, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GlobalService } from '../../../../core/global.service';
import {
  GoodsOrderEntity,
  GoodsOrderManagementHttpService,
} from '../goods-order-management-http.service';
import { HttpErrorEntity } from '../../../../core/http.service';

@Component({
  selector: 'app-goods-write-off',
  templateUrl: './goods-write-off.component.html',
  styleUrls: ['./goods-write-off.component.css']
})

export class GoodsWriteOffComponent implements OnInit {
  public noResultText = '数据加载中...';
  public isAllDisplayDataChecked = false;
  public isIndeterminate = false;
  public mapOfCheckedId: { [key: string]: boolean } = {};
  public checkedList: Array<any> = [];
  public writeOffList: Array<any> = [];
  public unWriteOffList: Array<any> = [];

  public currentOrder: GoodsOrderEntity = new GoodsOrderEntity();
  public sureName: string;
  public remark = '';
  public title = '';

  private order_id: string; // 订单id
  private sureCallback: any;
  private closeCallback: any;
  private subscription: Subscription;
  private searchText$ = new Subject<any>();

  @Input() public tagsList: Array<any> = [];

  @ViewChild('projectPromptDiv', { static: true }) public projectPromptDiv: ElementRef;
  @ViewChild('promptDiv', { static: true }) public promptDiv: ElementRef;

  constructor(private orderHttpService: GoodsOrderManagementHttpService,
    private globalService: GlobalService) {
  }

  ngOnInit() {
  }

  // 单选
  public refreshStatus() {
    const checkList = this.writeOffList;
    this.isAllDisplayDataChecked = checkList.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate = checkList.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
    this.checkedList = checkList.filter(item => this.mapOfCheckedId[item.id] === true).map(i => i.id);

  }

  // 全选
  public checkAll(value: boolean) {
    const checkAllList = this.writeOffList;
    checkAllList.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  // 初始化
  private initCheckBox() {
    this.isAllDisplayDataChecked = false;
    this.isIndeterminate = false;
    this.mapOfCheckedId = {};
    this.checkedList = [];
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
    this.initCheckBox();
    $(this.projectPromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param title 标题
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
    this.writeOffList = this.currentOrder.write_off_code;
    this.unWriteOffList = this.writeOffList.filter(i => i.write_off_status === 1);
    this.noResultText = '暂无数据';
    openProjectModal();
    return;
  }

  private clear() {
    this.remark = '';
    this.currentOrder = new GoodsOrderEntity();
  }

  // form提交
  public onEditFormSubmit() {
    const write_off_codes = this.checkedList.join(',');
    if (this.checkedList.length === 0) {
      this.globalService.promptBox.open('请勾选核销码!', null, 2000, '/assets/images/warning.png');
    } else {
      this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认核销？', () => {
        this.globalService.confirmationBox.close();
        // 核销券码
        this.orderHttpService.requestWriteOffCode(this.order_id, write_off_codes).subscribe(() => {
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
          if (content.code === 'business_is_out') {
            this.globalService.promptBox.open(`商家不存在或已下线!`, null, 2000, '/assets/images/warning.png');
            return;
          } else if (content.code === 'do_not_write_of') {
            this.globalService.promptBox.open(`含有无法核销的核销码!`, null, 2000, '/assets/images/warning.png');
          } else {
            this.globalService.promptBox.open('保存失败,请重试!', null, 2000, '/assets/images/warning.png');
          }
        }
      }
    }
  }
}

