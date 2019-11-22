import { Component, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { GoodsOrderEntity, GoodsOrderManagementHttpService, OrderDetailEntity } from '../goods-order-management-http.service';
import { GoodsOrderDeliveryComponent } from '../goods-order-delivery/goods-order-delivery.component';

@Component({
  selector: 'app-goods-order-detail',
  templateUrl: './goods-order-detail.component.html',
  styleUrls: ['./goods-order-detail.component.css']
})
export class GoodsOrderDetailComponent implements OnInit {

  public orderDetail: GoodsOrderEntity = new GoodsOrderEntity(); // 订单信息

  public goodsInfo: Array<OrderDetailEntity> = []; // 票务信

  private order_id: string; // 订单id

  @ViewChild('orderDeliveryComponent', { static: true }) public orderDeliveryComponent: GoodsOrderDeliveryComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private orderService: GoodsOrderManagementHttpService) {
    this.route.paramMap.subscribe(map => {
      this.order_id = map.get('order_id');
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
      this.goodsInfo = res.detail;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
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

}
