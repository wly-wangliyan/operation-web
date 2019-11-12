import { Component, OnInit } from '@angular/core';
import { TicketEntity } from '../../../ticket/product-management/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { GoodsOrderEntity, GoodsOrderManagementHttpService, OrderDetailEntity } from '../goods-order-management-http.service';

@Component({
  selector: 'app-goods-order-detail',
  templateUrl: './goods-order-detail.component.html',
  styleUrls: ['./goods-order-detail.component.css']
})
export class GoodsOrderDetailComponent implements OnInit {

  public orderDetail: GoodsOrderEntity = new GoodsOrderEntity(); // 订单信息

  public goodsInfo: Array<OrderDetailEntity> = []; // 票务信

  private order_id: string; // 订单id

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
}
