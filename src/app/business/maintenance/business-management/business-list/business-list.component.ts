import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BusinessEditComponent } from '../business-edit/business-edit.component';
import { Router } from '@angular/router';
import { BusinessManagementService, SearchUpkeepMerchantParams, UpkeepMerchantEntity } from '../business-management.service';
import { VehicleBrandEntity, VehicleTypeManagementService } from '../../vehicle-type-management/vehicle-type-management.service';
import { HttpErrorEntity } from '../../../../core/http.service';
import { VehicleTypeDataService } from '../../vehicle-type-management/vehicle-type-data.service';

const PageSize = 15;

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit, OnDestroy {

  public searchParams = new SearchUpkeepMerchantParams();
  public businessList: Array<UpkeepMerchantEntity> = [];
  public pageIndex = 1;
  public noResultText = '数据加载中...';
  private requestBrandSubscription: Subscription;
  public vehicleBrandList: Array<VehicleBrandEntity> = [];

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  @ViewChild(BusinessEditComponent, { static: true }) public businessEditComponent: BusinessEditComponent;

  private get pageCount(): number {
    if (this.businessList.length % PageSize === 0) {
      return this.businessList.length / PageSize;
    }
    return this.businessList.length / PageSize + 1;
  }

  constructor(
    private globalService: GlobalService,
    private businessManagementService: BusinessManagementService,
    private vehicleTypeManagementService: VehicleTypeManagementService,
    private vehicleDataService: VehicleTypeDataService,
    private router: Router) {
  }

  ngOnInit() {
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.businessManagementService.requestUpkeepMerchantList(this.searchParams))
    ).subscribe(res => {
      this.businessList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
      this.pageIndex = 1;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();

    // 获取车辆品牌列表
    this.vehicleDataService.requestVehicleBrandList();
    timer(500).subscribe(() => {
      this.vehicleBrandList = this.vehicleDataService.vehicleBrandList;
    });
  }

  public ngOnDestroy() {
    this.requestBrandSubscription && this.requestBrandSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 进入编辑商家页面
  public onEditBtnClick(data: UpkeepMerchantEntity) {
    this.router.navigate(['/main/maintenance/business-management/edit'],
      { queryParams: { upkeep_merchant_id: data.upkeep_merchant_id } });
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
    this.pageIndex = 1;
    this.searchText$.next();
  }

  // 进入运营页面
  public onOperationBtnClick(data: UpkeepMerchantEntity) {
    this.router.navigate(['/main/maintenance/business-management/operation-configuration'],
      { queryParams: { upkeep_merchant_id: data.upkeep_merchant_id } });
  }

  // 开启、关闭营业状态
  public onSwitchChange(upkeep_merchant_id, event) {
    const swith = event ? true : false;
    const params = { status: swith };
    this.businessManagementService.requestUpkeepMerchants(upkeep_merchant_id, params).subscribe(res => {
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
            if (content.code === 'not_allowed' && content.resource === 'status') {
              this.globalService.promptBox.open('该商家下没有产品，不允许开启！', null, 2000, '/assets/images/warning.png');
            } else if (content.code === 'config_not_allowed' && content.resource === 'status') {
              this.globalService.promptBox.open('该商家未开通支付账号，请开通后再试！', null, 2000, '/assets/images/warning.png');
            } else if (content.code === 'missing_operation_times' && content.resource === 'upkeep_merchant') {
              this.globalService.promptBox.open('未设置运营时段，请设置后再试！', null, 2000, '/assets/images/warning.png');
            } else {
              this.globalService.promptBox.open('参数错误或无效！', null, 2000, '/assets/images/warning.png');
            }
          }
        }
      }
      this.searchText$.next();
    });
  }
}
