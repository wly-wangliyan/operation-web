import { Component, OnInit } from '@angular/core';
import { OrderManagementService, OrderEntity } from '../order-management.service';
import { GlobalService } from '../../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  public orderDetail: OrderEntity = new OrderEntity(); // 订单信息

  private order_id: string; // 订单id

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private orderService: OrderManagementService) {
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
    this.orderService.requestOrderDetailData(this.order_id).subscribe(res => {
      this.orderDetail = res;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

}
