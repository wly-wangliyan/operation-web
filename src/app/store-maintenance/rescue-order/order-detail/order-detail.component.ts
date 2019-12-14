import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../core/global.service';
import { RescueOrderService, RescueOrderEntity } from '../rescue-order.service';
import { PromptLoadingComponent } from '../../../share/components/prompt-loading/prompt-loading.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit, AfterViewInit {

  public orderRecord: RescueOrderEntity = new RescueOrderEntity();

  public loading = false;

  private order_id: string; // order_id

  @ViewChild(PromptLoadingComponent, { static: true }) public promptLoading: PromptLoadingComponent;

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

  public ngAfterViewInit() {
    this.promptLoading.open(null, true);
  }

  // 获取订单详情
  private getOrderDetail(): void {
    this.rescueOrderService.requestOrderDetailData(this.order_id).subscribe(data => {
      this.orderRecord = data;
      this.promptLoading.close();
    }, err => {
      this.promptLoading.close();
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 404) {
          this.globalService.promptBox.open('订单不存在！', null, 2000, null, false);
          return;
        }
      }
    });
  }
}
