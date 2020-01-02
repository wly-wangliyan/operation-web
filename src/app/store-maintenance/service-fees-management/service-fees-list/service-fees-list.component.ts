import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import {
  ServiceFeeEntity,
  ServiceFeesManagementService,
  SearchParams,
} from '../service-fees-management.service';
import { Subject, Subscription } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/operators';

const PageSize = 15;

@Component({
  selector: 'app-service-fees-list',
  templateUrl: './service-fees-list.component.html',
  styleUrls: ['./service-fees-list.component.css']
})
export class ServiceFeesListComponent implements OnInit {

  public serviceFeeList: Array<ServiceFeeEntity> = [];
  public pageIndex = 1;
  public searchParams = new SearchParams();
  public noResultText = '数据加载中...';
  public tabs: Array<any> = [];
  public selectedTabIndex: number;

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  private get pageCount(): number {
    if (this.serviceFeeList.length % PageSize === 0) {
      return this.serviceFeeList.length / PageSize;
    }
    return this.serviceFeeList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService, private feesService: ServiceFeesManagementService) { }

  ngOnInit() {
    this.tabs = [
      { key: 1, value: '救援费管理' },
    ];
    this.selectedTabIndex = 0;
    // 救援费管理列表
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.feesService.requestServiceFeeListData(this.searchParams))
    ).subscribe(res => {
      this.serviceFeeList = res.results;
      this.getPriceData();
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  /**
   * 列表价格数据计算
   * 原价：尾款原价+预付原价
   * 现价：尾款现价+预付现价
   */
  private getPriceData() {
    this.serviceFeeList.forEach(i => {
      i.initial_price = i.balance_initial_price && i.prepay_initial_price
        ? Number(i.balance_initial_price) + Number(i.prepay_initial_price) : i.balance_initial_price || i.prepay_initial_price
        || 0;
      i.current_price = i.balance_current_price && i.prepay_current_price
        ? Number(i.balance_current_price) + Number(i.prepay_current_price) : i.balance_current_price || i.prepay_current_price
        || 0;
    });
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
      this.continueRequestSubscription = this.feesService.continueServiceFeeListData(this.linkUrl).subscribe(res => {
        this.serviceFeeList = this.serviceFeeList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }
}
