import { Component, OnInit, ViewChild } from '@angular/core';
import { IntegralOrderEntity, OrderDetailEntity, IntegralOrderHttpService } from '../integral-order-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/core/global.service';
import { OrderRemarkComponent } from '../order-remark/order-remark.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  public orderDetail: IntegralOrderEntity = new IntegralOrderEntity(); // 订单信息

  public commodityInfo: Array<OrderDetailEntity> = []; // 商品明细

  public type: string; // 商品类型

  public orderStepStatus: number; // 订单流程状态

  public orderInfo: string; // 收件人信息

  private integral_order_id: string; // 订单id

  @ViewChild('orderRemark', { static: true }) public orderRemark: OrderRemarkComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private orderService: IntegralOrderHttpService) {
    this.route.paramMap.subscribe(map => {
      this.integral_order_id = map.get('integral_order_id');
      this.type = map.get('type');
    });
  }

  public ngOnInit() {
    if (this.integral_order_id) {
      this.getOrderDetail();
    } else {
      this.router.navigate(['../../../list'], { relativeTo: this.route });
    }
  }


  // 获取订单信息
  private getOrderDetail() {
    this.orderService.requestIntegralOrderDetail(this.integral_order_id).subscribe(res => {
      this.orderDetail = res;
      this.orderStatusChange();
      this.commodityInfo = res.detail;
      this.orderInfo = `${this.orderDetail.name}${this.orderDetail.telephone}`;
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        this.globalService.promptBox.open('订单详情获取失败！', null, 2000, null, false);
      }
    });
  }

  private orderStatusChange() {
    if (this.orderDetail.pay_status === 1) {
      this.orderStepStatus = 0; // 未支付
    } else if (this.orderDetail.order_status === 2 && this.orderDetail.pay_status === 2) {
      this.orderStepStatus = 4; // 已完成
    } else if (this.orderDetail.pay_status === 3) {
      this.orderStepStatus = 6; // 已关闭(已取消：超时未支付)
    }
  }

  /*
  * 修改备注信息
  * @param data IntegralOrderEntity 商品信息
  * */
  public onUpdateRemarkClick(title: string) {
    this.orderRemark.open(title, this.orderDetail.clone(), () => {
      this.getOrderDetail();
    }, '保存');
  }
}
