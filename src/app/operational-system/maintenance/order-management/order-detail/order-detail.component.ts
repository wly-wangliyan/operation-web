import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import {
  UpkeepOrderEntity,
  OrderDetailEntity,
  OrderManagementService,
} from '../order-management.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  public upkeepOrderData = new UpkeepOrderEntity();
  public orderDetailList: Array<OrderDetailEntity> = [];
  public noResultText = '数据加载中...';
  public loading = true;
  public itemRowSpan1: number;
  public itemRowSpan2: number;
  public itemRowSpan3: number;

  private upkeep_order_id: string;
  private searchText$ = new Subject<any>();
  private itemRowArr1: Array<any> = [];
  private itemRowArr2: Array<any> = [];
  private itemRowArr3: Array<any> = [];

  constructor(private globalService: GlobalService,
              private orderService: OrderManagementService,
              private routeInfo: ActivatedRoute) { }

  ngOnInit() {
    this.routeInfo.params.subscribe((params: Params) => {
      this.upkeep_order_id = params.upkeep_order_id;
    });

    // 订单详情
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.orderService.requestOrderDetail(this.upkeep_order_id))
    ).subscribe(res => {
      this.upkeepOrderData = res;
      const orderDetailList = this.upkeepOrderData.order_detail;
      // 合并单元格
      this.itemRowArr1 = orderDetailList && orderDetailList.filter(i => i.item_category === 1);
      this.itemRowArr2 = orderDetailList && orderDetailList.filter(i => i.item_category === 2);
      this.itemRowArr3 = orderDetailList && orderDetailList.filter(i => i.item_category === 3);
      this.orderDetailList = this.itemRowArr1 && this.itemRowArr1.concat(this.itemRowArr2, this.itemRowArr3);
      this.itemRowSpan1 = this.itemRowArr1.length;
      this.itemRowSpan2 = this.itemRowArr2.length;
      this.itemRowSpan3 = this.itemRowArr3.length;
      this.noResultText = '暂无数据';
      this.loading = false;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }
}
