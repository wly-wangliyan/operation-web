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

  private upkeep_order_id: string;
  private searchText$ = new Subject<any>();
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
      this.orderDetailList = this.upkeepOrderData.order_detail;
      this.noResultText = '暂无数据';
      this.loading = false;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

}
