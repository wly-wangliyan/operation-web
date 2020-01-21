import { Component, OnInit } from '@angular/core';
import { UpkeepOrderService, ArrivalOrderEntity, AccessoryInfoEntity, SpecificationInfoEntity } from '../upkeep-order.service';
import { GlobalService } from '../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpErrorEntity } from '../../../core/http.service';
import { ProjectEntity } from '../../accessory-library/accessory-library.service';
@Component({
  selector: 'app-arrival-order-detail',
  templateUrl: './arrival-order-detail.component.html',
  styleUrls: ['./arrival-order-detail.component.css']
})
export class ArrivalOrderDetailComponent implements OnInit {
  public orderRecord: ArrivalOrderEntity = new ArrivalOrderEntity(); // 到店保养订单详情
  public projectIds = ['11', '12', '10']; // 11:机油 12:机油滤清器 10:蓄电池
  public mapOfAccessory: { [key: string]: Array<SpecificationInfoEntity> } = {}; // 保养项目对应配件

  private order_id: string; // order_id
  private searchText$ = new Subject<any>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private orderService: UpkeepOrderService) {
    this.route.paramMap.subscribe(map => {
      this.order_id = map.get('order_id');
    });
  }

  public ngOnInit() {
    if (this.order_id) {
      this.searchText$.pipe(debounceTime(500)).subscribe(() => {
        this.getOrderDetail();
      });
      this.searchText$.next();
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  // 获取订单详情
  private getOrderDetail(): void {
    this.orderService.requestArrivalOrderDetailData(this.order_id).subscribe(data => {
      this.orderRecord = data;
    }, err => {
      // 测试代码
      // this.orderRecord.order_id = 'e830cf9438ea11ea8ace0242ac150006';
      // this.orderRecord.accessory_info.push(new SpecificationInfoEntity());
      // this.orderRecord.accessory_info[0].accessory = new AccessoryInfoEntity();
      // this.orderRecord.accessory_info[0].project = new ProjectEntity();
      // this.orderRecord.accessory_info[0].project.project_number = '11';
      // this.mapOfAccessory['11'] = this.orderRecord.accessory_info;
      // this.mapOfAccessory['12'] = this.orderRecord.accessory_info;
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 404) {
          this.orderRecord = null;
          this.globalService.promptBox.open('订单不存在！', null, 2000, null, false);
          return;
        }
      }
    });
  }

}
