import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BrokerageEntity, OrderManagementService } from '../order-management.service';

const PageSize = 15;

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  public brokerageList: Array<BrokerageEntity> = [];
  public pageIndex = 1;
  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  private get pageCount(): number {
    if (this.brokerageList.length % PageSize === 0) {
      return this.brokerageList.length / PageSize;
    }
    return this.brokerageList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
              private orderService: OrderManagementService) {
  }

  ngOnInit() {
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.orderService.requestBrokerageList())
    ).subscribe(res => {
      this.brokerageList = res.results;
      this.brokerageList.forEach(value => {
        const ic_company_name = [];
        value.ic_company.forEach(value1 => {
          ic_company_name.push(value1.ic_name);
        });
        value.ic_company_name = ic_company_name.join(',');
      });
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }


  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.orderService.continueBrokerageList(this.linkUrl).subscribe(res => {
        this.brokerageList = this.brokerageList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }
}
