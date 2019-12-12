import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../core/global.service';
import { RescueOrderService, RescueOrderEntity } from '../rescue-order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  public orderRecord: RescueOrderEntity = new RescueOrderEntity();

  private order_id: string; // order_id

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private rescueOrderService: RescueOrderService
  ) {
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

  // 获取订单详情
  private getOrderDetail(): void {
    this.rescueOrderService.requestOrderDetailData(this.order_id).subscribe(data => {
      this.orderRecord = data;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

}
