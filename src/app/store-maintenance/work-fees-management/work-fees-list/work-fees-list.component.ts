import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import {
  UpkeepOrderEntity,
  OrderManagementService,
  SearchOrderParams,
} from 'src/app/store-maintenance/order-management/order-management.service';
import { Subject, Subscription } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/operators';

const PageSize = 15;

@Component({
  selector: 'app-work-fees-list',
  templateUrl: './work-fees-list.component.html',
  styleUrls: ['./work-fees-list.component.css']
})
export class WorkFeesListComponent implements OnInit {

  public orderList: Array<UpkeepOrderEntity> = [];
  public pageIndex = 1;
  public searchParams = new SearchOrderParams();
  public noResultText = '数据加载中...';
  public start_pay_time = null; // 支付时间
  public end_pay_time = null;
  public start_reserve_time = null; // 预定时间
  public end_reserve_time = null;
  public workerList: Array<any> = [];
  public tabs: Array<any> = [];
  public selectedTabIndex: number;

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  private get pageCount(): number {
    if (this.orderList.length % PageSize === 0) {
      return this.orderList.length / PageSize;
    }
    return this.orderList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService, private orderService: OrderManagementService) { }

  ngOnInit() {
    this.tabs = [
      { key: 1, value: '救援费管理' },
    ];
    this.selectedTabIndex = 0;
    // this.onTabChange(this.selectedTabIndex);
    // 订单管理列表
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.orderService.requestOrderList(this.searchParams))
    ).subscribe(res => {
      this.orderList = res.results.map(i => ({ ...i, item_categorys: i.upkeep_item_categorys ? i.upkeep_item_categorys.split(',') : [] }));
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 查询按钮
  public onSearchBtnClick() {
    this.pageIndex = 1;
    this.searchText$.next();
  }


  // 分页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      // tslint:disable-next-line:no-unused-expression
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.orderService.continueOrderList(this.linkUrl).subscribe(res => {
        this.orderList = this.orderList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }
}
