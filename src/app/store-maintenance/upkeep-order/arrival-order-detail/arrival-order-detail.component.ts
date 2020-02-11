import { Component, OnInit } from '@angular/core';
import { UpkeepOrderService, ArrivalOrderEntity, AccessoryItem } from '../upkeep-order.service';
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
  public mapOfAccessory: { [key: string]: Array<AccessoryItem> } = {}; // 保养项目对应配件
  public img_urls = [];

  private arrival_order_id: string; // arrival_order_id
  private searchText$ = new Subject<any>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private orderService: UpkeepOrderService) {
    this.route.paramMap.subscribe(map => {
      this.arrival_order_id = map.get('arrival_order_id');
    });
  }

  public ngOnInit() {
    if (this.arrival_order_id) {
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
    this.orderService.requestArrivalOrderDetailData(this.arrival_order_id).subscribe(data => {
      this.orderRecord = data;
      this.projectIds.forEach(projectid =>
        this.mapOfAccessory[projectid] = data.accessory_info.filter(item => item.project_number === projectid)
      );
      this.img_urls = data.check_images ? data.check_images.split(',') : [];
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 404) {
          this.orderRecord = null;
          this.globalService.promptBox.open('订单不存在！', null, 2000, null, false);
          return;
        }
      }
    });
  }

  // 服务完成
  public onFinishClick(): void {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，请确认是否已完成保养服务，且车主已知晓并同意完成服务？', () => {
      this.globalService.confirmationBox.close();
      this.orderService.requestFinishDate(this.arrival_order_id).subscribe(res => {
        this.globalService.promptBox.open('已完成服务');
        this.searchText$.next();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.globalService.promptBox.open('未完成服务！', null, 2000, null, false);
        }
      });
    });
  }

}
