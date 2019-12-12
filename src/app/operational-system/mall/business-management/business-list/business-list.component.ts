import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { HttpErrorEntity } from '../../../../core/http.service';
import { BusinessEntity, BusinessManagementService, SearchParams } from '../business-management.service';

const PageSize = 15;

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit {

  public businessList: Array<BusinessEntity> = [];
  public pageIndex = 1;
  public noResultText = '数据加载中...';
  public searchParams = new SearchParams();
  public vehicleBrandList = [];
  public vehicleFirmList = [];
  public vehicleSeriesList = [];

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  private get pageCount(): number {
    if (this.businessList.length % PageSize === 0) {
      return this.businessList.length / PageSize;
    }
    return this.businessList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
              private businessService: BusinessManagementService) {
  }

  ngOnInit() {
    this.searchText$.pipe(
        debounceTime(500),
        switchMap(() =>
            this.businessService.requestBusinessList(this.searchParams))
    ).subscribe(res => {
      this.businessList = res.results;
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
      this.continueRequestSubscription = this.businessService.continueBusinessList(this.linkUrl).subscribe(res => {
        this.businessList = this.businessList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 开启、关闭商家营业状态
  public onSwitchChange(mall_business_id, event) {
    const swith = event ? 1 : 2;
    const params = { status: swith };
    this.businessService.requestBusinessStatus(mall_business_id, params).subscribe(res => {
      if (event) {
        this.globalService.promptBox.open('开启成功', null, 2000, '/assets/images/success.png');
      } else {
        this.globalService.promptBox.open('关闭成功', null, 2000, '/assets/images/success.png');
      }
      this.searchText$.next();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            this.globalService.promptBox.open('参数错误或无效！', null, 2000, '/assets/images/warning.png');
          }
        }
      }
      this.searchText$.next();
    });
  }

  // 查询
  public onSearchBtnClick() {
    this.pageIndex = 1;
    this.searchText$.next();
  }
}
