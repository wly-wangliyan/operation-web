import { Component, OnInit } from '@angular/core';
import { OrderManagementService, TicketOrderEntity, VisitorInfo } from '../order-management.service';
import { GlobalService } from '../../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  public orderDetail: TicketOrderEntity = new TicketOrderEntity(); // 订单信息

  public visitorList: Array<VisitorInfo> = []; // 游客信息

  private order_id: string; // 订单id

  // 支付方式
  public payType = {
    'UU-UU': '悠悠',
    'UU-WX': '微信',
    'WX-WX': '微信',
    other: '其他'
  };

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
      this.visitorList = res.tourists ? res.tourists : [];
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 重新发送短信
  public onResendMessage() {
    this.orderService.requestResendMessage(this.order_id).subscribe(res => {
      this.globalService.promptBox.open('短信重发成功！');
      this.getOrderDetail();
    }, err => {
      this.globalService.promptBox.open('短信重发失败，请稍后再试！');
    });
  }

}
