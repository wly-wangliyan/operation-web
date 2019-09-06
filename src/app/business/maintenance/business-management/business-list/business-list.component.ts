import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { BrokerageEntity, InsuranceService } from '../../../insurance/insurance.service';
import { debounceTime, switchMap } from 'rxjs/operators';

const PageSize = 15;

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit {

  public searchParams = {};
  public businessList: any;
  public pageIndex = 1;
  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  // @ViewChild(BrokerageCompanyEditComponent, {static: true}) public brokerageEditComponent: BrokerageCompanyEditComponent;

  private get pageCount(): number {
    if (this.businessList.length % PageSize === 0) {
      return this.businessList.length / PageSize;
    }
    return this.businessList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
              private insuranceService: InsuranceService) {
  }

  ngOnInit() {
    this.searchText$.pipe(
        debounceTime(500),
        switchMap(() =>
            this.insuranceService.requestBrokerageList())
    ).subscribe(res => {
      this.businessList = res.results;
      this.businessList.forEach(value => {
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

  // 显示添加编辑项目modal
  public onEditBtnClick(data: BrokerageEntity) {
    /*this.brokerageEditComponent.open(data.broker_company_id, () => {
      this.pageIndex = 1;
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    }, '保存', null);*/
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.insuranceService.continueBrokerageList(this.linkUrl).subscribe(res => {
        this.businessList = this.businessList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }
  public onSearchBtnClick() {

  }
}
