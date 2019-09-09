import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { BusinessEditComponent } from '../business-edit/business-edit.component';
import { GlobalService } from '../../../../core/global.service';
import { BrokerageEntity, InsuranceService } from '../../../insurance/insurance.service';
import { Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';

const PageSize = 15;

@Component({
  selector: 'app-operation-configuration',
  templateUrl: './operation-configuration.component.html',
  styleUrls: ['./operation-configuration.component.css']
})
export class OperationConfigurationComponent implements OnInit {

  public searchParams = {};
  public businessList: any;
  public pageIndex = 1;
  public noResultText = '数据加载中...';
  public tabIndex = 1;
  public bookingTimes = [];

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
              private insuranceService: InsuranceService,
              private router: Router) {
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
    this.router.navigate(['/main/maintenance/business-management/edit'],
        { queryParams: {} });
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

  // 切换Tab
  public onTabClicked(index) {
    this.tabIndex = index;
  }

  onChange(result: Date): void {
    console.log('Selected Time: ', result);
  }

  onOk(result: Date): void {
    console.log('onOk', result);
  }

  public onAddClick() {

  }
}
