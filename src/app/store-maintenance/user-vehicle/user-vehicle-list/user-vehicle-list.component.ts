import { Component, OnInit } from '@angular/core';
import {
  VehicleManagementHttpService,
  CarBrandEntity,
  CarFactoryEntity,
  CarSeriesEntity
} from '../../vehicle-management/vehicle-management-http.service';
import { GlobalService } from '../../../core/global.service';
import { SearchParams, UserVehicleHttpService } from '../user-vehicle-http.service';
import { NzSearchAssistant } from 'src/app/share/nz-search-assistant';
import { environment } from 'src/environments/environment';
import { NzSearchAdapter } from 'src/app/share/nz-search-assistant';

@Component({
  selector: 'app-user-vehicle-list',
  templateUrl: './user-vehicle-list.component.html',
  styleUrls: ['./user-vehicle-list.component.css']
})
export class UserVehicleListComponent implements OnInit, NzSearchAdapter {
  public searchParams = new SearchParams();
  public carBrandList: Array<CarBrandEntity> = [];
  public carFactoryList: Array<CarFactoryEntity> = [];
  public carSeriesList: Array<CarSeriesEntity> = [];
  public carParamList: Array<any> = [];
  public nzSearchAssistant: NzSearchAssistant;
  private searchUrl: string;
  constructor(
    private globalService: GlobalService,
    private vehicleManagementService: VehicleManagementHttpService,
    private userVehicleHttpService: UserVehicleHttpService) {
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  ngOnInit() {
  }

  // 数据导出
  public onExportRecords() {
    if (this.generateAndCheckParamsValid() && this.searchUrl) {
      window.open(this.searchUrl);
    }
  }

  // 变更品牌
  public onChangeBrand(event: any) {
    this.searchParams.car_factory_id = '';
    this.searchParams.car_series_id = '';
    this.searchParams.car_displacement = '';
    this.carFactoryList = [];
    this.carSeriesList = [];
    this.carParamList = [];
    if (event.target.value) {
      this.requestFactoryListByBrand(event.target.value);
    }
  }

  // 变更厂商
  public onChangeFactory(event: any) {
    this.searchParams.car_series_id = '';
    this.searchParams.car_displacement = '';
    this.carSeriesList = [];
    this.carParamList = [];
    if (event.target.value) {
      this.requestSeriesListByFactory(this.searchParams.car_brand_id, event.target.value);
    }
  }

  // 变更车系
  public onChangeSeries(event: any) {
    this.searchParams.car_displacement = '';
    this.carParamList = [];
    if (event.target.value) {
      this.requestDisplacementListBySeries(event.target.value);
    }
  }

  // 查询
  public onSearchBtnClick() {
    this.nzSearchAssistant.submitSearch(true);
  }

  // 导出url
  private exportSearchUrl() {
    // TODO: 替换接口地址
    this.searchUrl = `${environment.STORE_DOMAIN}/export?1=1`;
    const params = this.searchParams.json();
    for (const key in params) {
      if (params[key]) {
        this.searchUrl += `&${key}=${params[key]}`;
      }
    }
  }

  /* SearchDecorator 接口实现 */
  /* 请求检索 */
  public requestSearch(): any {
    return this.userVehicleHttpService.requestUserVehicleListData(this.searchParams);
  }

  public continueSearch(url: string): any {
    return this.userVehicleHttpService.continueUserVehicleListData(url);
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    return true;
  }

  /* 检索失败处理 */
  public searchErrProcess(err: any) {
    this.globalService.httpErrorProcess(err);
  }

  /* 检索成功处理 */
  public searchCompleteProcess() { this.exportSearchUrl(); }

  // 通过品牌请求厂商下拉列表
  private requestFactoryListByBrand(car_brand_id: string) {
    this.vehicleManagementService.requestCarFactoryListData(car_brand_id)
      .subscribe(res => {
        this.carFactoryList = res.results;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  // 通过厂商请求车系下拉列表
  private requestSeriesListByFactory(car_brand_id: string, car_factory_id: string) {
    this.vehicleManagementService.requestCarSeriesListData(car_brand_id, car_factory_id)
      .subscribe(res => {
        this.carSeriesList = res.results;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  // 通过车系请求排量下拉列表
  private requestDisplacementListBySeries(car_series_id: string) {
    this.vehicleManagementService.requestCarParamListData(car_series_id)
      .subscribe(res => {
        this.carParamList = res.body;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

}
