import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BusinessManagementService, SearchUpkeepMerchantParams, UpkeepMerchantEntity } from '../../../business-management.service';
import { Subject, Subscription } from 'rxjs';
import { BusinessEditComponent } from '../../../business-edit/business-edit.component';
import { GlobalService } from '../../../../../../core/global.service';
import { Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ProductEntity, ProductLibraryHttpService, SearchParams } from '../../../../product-library/product-library-http.service';
import { HttpErrorEntity } from '../../../../../../core/http.service';
import {
  VehicleBrandEntity,
  VehicleFirmEntity,
  VehicleTypeManagementService
} from '../../../../vehicle-type-management/vehicle-type-management.service';

const PageSize = 15;

@Component({
  selector: 'app-choose-accessory',
  templateUrl: './choose-accessory.component.html',
  styleUrls: ['./choose-accessory.component.css']
})
export class ChooseAccessoryComponent implements OnInit {

  public searchParams: SearchParams = new SearchParams(); // 条件筛选

  public productList: Array<ProductEntity> = []; // 产品列表

  public pageIndex = 1; // 当前页码

  public noResultText = '数据加载中...';

  public upkeep_item_type: number;

  public vehicleBrandList: Array<VehicleBrandEntity> = [];

  public vehicleFirmList: Array<VehicleFirmEntity> = [];

  private searchText$ = new Subject<any>();

  private continueRequestSubscription: Subscription; // 分页获取数据

  private linkUrl: string;

  @Output('selectAccessory') public selectAccessory = new EventEmitter();

  private get pageCount(): number {
    if (this.productList.length % PageSize === 0) {
      return this.productList.length / PageSize;
    }
    return this.productList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
              private productLibraryService: ProductLibraryHttpService,
              private vehicleTypeManagementService: VehicleTypeManagementService,
              private router: Router) {
  }

  ngOnInit() {
    this.productList.push(new ProductEntity());
    this.continueRequestSubscription =
        this.vehicleTypeManagementService.requestVehicleBrandList().subscribe(res => {
          this.vehicleBrandList = res.results;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
  }

  public initAccessoryType() {
    this.searchParams.upkeep_accessory_type = this.upkeep_item_type;
    this.searchParams = new SearchParams();
    this.generateProductList();
  }

  // 初始化获取产品列表
  private generateProductList() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestProductList();
    });
    this.searchText$.next();
  }

  // 请求产品列表
  private requestProductList() {
    this.productLibraryService.requestProductListData(this.searchParams).subscribe(res => {
      this.productList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {

        }
      }
    });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.productLibraryService.continueProductListData(this.linkUrl)
          .subscribe(res => {
            this.productList = this.productList.concat(res.results);
            this.linkUrl = res.linkUrl;
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
    }
  }

  public onSearchBtnClick() {
    this.searchText$.next();
  }

  // 选择配件
  public onChooseClick(data) {
    this.selectAccessory.emit(data);
  }

  public onBrandChange() {
    this.vehicleFirmList = [];
    this.continueRequestSubscription =
        this.vehicleTypeManagementService.requestVehicleFirmList(this.searchParams.vehicle_brand_id).subscribe(res => {
          this.vehicleFirmList = res;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
  }
}
