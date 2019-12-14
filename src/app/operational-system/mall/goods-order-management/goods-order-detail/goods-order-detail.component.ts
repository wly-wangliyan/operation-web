import { Component, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import {
  GoodsOrderEntity, GoodsOrderManagementHttpService, OrderDetailEntity
  , WriteOffEntity
} from '../goods-order-management-http.service';
import { GoodsOrderDeliveryComponent } from '../goods-order-delivery/goods-order-delivery.component';
import { GoodsOrderRefundComponent } from '../goods-order-refund/goods-order-refund.component';
import { GoodsOrderRemarkComponent } from '../goods-order-remark/goods-order-remark.component';
import { GoodsWriteOffComponent } from '../goods-write-off/goods-write-off.component';

@Component({
  selector: 'app-goods-order-detail',
  templateUrl: './goods-order-detail.component.html',
  styleUrls: ['./goods-order-detail.component.css']
})
export class GoodsOrderDetailComponent implements OnInit {

  public orderDetail: GoodsOrderEntity = new GoodsOrderEntity(); // 订单信息

  public goodsInfo: Array<OrderDetailEntity> = []; // 商品明细

  public writeOffList: Array<WriteOffEntity> = []; // 商品核销

  private order_id: string; // 订单id

  public type: string; // 商品类型

  public orderStepStatus: number; // 订单流程状态

  public orderInfo: string; // 收件人信息

  @ViewChild('orderDeliveryComponent', { static: true }) public orderDeliveryComponent: GoodsOrderDeliveryComponent;
  @ViewChild('orderRefund', { static: true }) public orderRefund: GoodsOrderRefundComponent;
  @ViewChild('orderRemark', { static: true }) public orderRemark: GoodsOrderRemarkComponent;
  @ViewChild('writeOff', { static: true }) public writeOff: GoodsWriteOffComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private orderService: GoodsOrderManagementHttpService) {
    this.route.paramMap.subscribe(map => {
      this.order_id = map.get('order_id');
      this.type = map.get('type');
    });
  }

  public ngOnInit() {
    if (this.order_id) {
      this.getOrderDetail();
    } else {
      this.router.navigate(['../../list'], { relativeTo: this.route });
    }
  }

  // 获取订单信息
  private getOrderDetail() {
    this.orderService.requestOrderDetail(this.order_id).subscribe(res => {
      this.orderDetail = res;
      this.orderStatusChange();
      this.goodsInfo = res.detail;
      this.writeOffList = res.write_off_code;
      this.orderInfo = `${this.orderDetail.contact}${this.orderDetail.mobile}${this.type === '1'
        ? (this.orderDetail.delivery_region + this.orderDetail.delivery_address) : ''}`;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  private orderStatusChange() {
    if (this.orderDetail.pay_status === 1) {
      this.orderStepStatus = 0; // 未支付
    } else if (this.orderDetail.delivery_status === 1) {
      this.orderStepStatus = 1; // 待发货
    } else if (this.orderDetail.delivery_status === 2) {
      if (this.orderDetail.is_delivery === 1) {
        this.orderStepStatus = 2; // 已发货（物流发货）
      } else {
        this.orderStepStatus = 3; // 已发货（无须配送）
      }
    } else if (this.orderDetail.order_status === 2 && this.orderDetail.pay_status !== 3) {
      this.orderStepStatus = 4; // 已完成
    } else if (this.orderDetail.pay_status === 3) {
      if (this.orderDetail.refund_status === 2) {
        this.orderStepStatus = 5; // 已关闭(全额退款)
      } else {
        this.orderStepStatus = 6; // 已关闭(已取消：超时未支付)
      }
    }
  }

  /*
  * 确认收货
  * @param data GoodsOrderEntity 商品信息
  * */
  public onConfiemClick(data: GoodsOrderEntity) {
    this.globalService.confirmationBox.open('提示', '确认收货后无法撤销，确认此操作吗？', () => {
      this.globalService.confirmationBox.close();
      this.orderService.requestConfirmReceipt(data.order_id).subscribe(res => {
        this.getOrderDetail();
        this.globalService.promptBox.open('确认收货成功！');
      });
    });
  }

  /*
  * 编辑物流信息
  * @param data GoodsOrderEntity 商品信息
  * */
  public onEditDeliveryClick(data: GoodsOrderEntity) {
    this.orderDeliveryComponent.open(data, () => {
      timer(0).subscribe(() => {
        this.getOrderDetail();
      });
    }, '保存');
  }

  /*
  * 退款
  * @param data GoodsOrderEntity 商品信息
  * */
  public onEditRefundClick(data: GoodsOrderEntity) {
    this.orderRefund.open(data, () => {
      timer(0).subscribe(() => {
        this.getOrderDetail();
      });
    }, '确认退款');
  }

  /*
  * 修改备注信息
  * @param data GoodsOrderEntity 商品信息
  * */
  public onUpdateRemarkClick(title: string, data: GoodsOrderEntity) {
    this.orderRemark.open(title, data, () => {
      timer(0).subscribe(() => {
        this.getOrderDetail();
      });
    }, '保存');
  }

  // 核销
  public onWriteOff(data: GoodsOrderEntity) {
    this.writeOff.open(data, () => {
      timer(0).subscribe(() => {
        this.getOrderDetail();
      });
    });
  }
}
