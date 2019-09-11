import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { BrokerageEntity, InsuranceService } from '../../../insurance/insurance.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BusinessEditComponent } from '../business-edit/business-edit.component';
import { Router } from '@angular/router';
import { BusinessManagementService, SearchUpkeepMerchantParams, UpkeepMerchantEntity } from '../business-management.service';

const PageSize = 15;

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit {

  public searchParams = new SearchUpkeepMerchantParams();
  public businessList: Array<UpkeepMerchantEntity> = [];
  public pageIndex = 1;
  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  @ViewChild(BusinessEditComponent, {static: true}) public businessEditComponent: BusinessEditComponent;

  private get pageCount(): number {
    if (this.businessList.length % PageSize === 0) {
      return this.businessList.length / PageSize;
    }
    return this.businessList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
              private businessManagementService: BusinessManagementService,
              private router: Router) {
  }

  ngOnInit() {
    // this.searchText$.pipe(
    //     debounceTime(500),
    //     switchMap(() =>
    //         this.businessManagementService.requestUpkeepMerchantList(this.searchParams))
    // ).subscribe(res => {
    //   this.businessList = res.results;
    //   this.linkUrl = res.linkUrl;
    //   this.noResultText = '暂无数据';
    // }, err => {
    //   this.globalService.httpErrorProcess(err);
    // });
    // this.searchText$.next();
    const temp = [];
    temp.push({aa: '1', bb: '2'});
    this.businessList = temp;
  }

  // 进入编辑商家页面
  public onEditBtnClick(data: UpkeepMerchantEntity) {
    this.router.navigate(['/main/maintenance/business-management/edit'],
        { queryParams: {upkeepMerchant: data} });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.businessManagementService.continueUpkeepMerchantList(this.linkUrl).subscribe(res => {
        this.businessList = this.businessList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }
  public onSearchBtnClick() {

  }

  // 进入运营页面
  public onOperationBtnClick(data) {
    this.router.navigate(['/main/maintenance/business-management/operation-configuration'],
        { queryParams: {} });
  }

  // 开启、关闭营业状态
  public onSwitchChange(upkeep_merchant_id, event) {
    const swith = event ? 'True' : 'False';
    const params = {status: swith};
    this.businessManagementService.requestUpkeepMerchants(upkeep_merchant_id, params).subscribe(res => {
      if (event) {
        this.globalService.promptBox.open('开启成功');
      } else {
        this.globalService.promptBox.open('关闭成功');
      }
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          if (event) {
            this.globalService.promptBox.open('开启失败，请重试', null, 2000, '/assets/images/warning.png');
          } else {
            this.globalService.promptBox.open('关闭失败，请重试', null, 2000, '/assets/images/warning.png');
          }
        }
      }
      this.searchText$.next();
    });
  }
}
