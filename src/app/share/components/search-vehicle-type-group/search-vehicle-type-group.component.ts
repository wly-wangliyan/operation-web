import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import { Subscription, timer } from 'rxjs';
import {
  VehicleBrandEntity,
  VehicleFirmEntity,
  VehicleSeriesEntity,
  VehicleTypeManagementService
} from '../../../business/maintenance/vehicle-type-management/vehicle-type-management.service';

@Component({
  selector: 'app-search-vehicle-type-group',
  templateUrl: './search-vehicle-type-group.component.html',
  styleUrls: ['./search-vehicle-type-group.component.css']
})
export class SearchVehicleTypeGroupComponent implements OnInit, OnDestroy {

  @Input() public display_firm = false; // 标记是否隐藏厂商

  @Input() public display_series = false; // 标记是否隐藏车系

  public vehicleBrandList: Array<VehicleBrandEntity> = []; // 车辆品牌列表

  public vehicleFirmList: Array<VehicleFirmEntity> = []; // 当前类别下厂商列表

  public vehicleSeriesList: Array<VehicleSeriesEntity> = []; // 当前厂商下车系列表

  private tmpMapOfFirm: { [key: string]: Array<VehicleFirmEntity> } = {}; // 临时存储已获取的品牌对应厂商

  private tmpMapOfSeries: { [key: string]: Array<VehicleSeriesEntity> } = {}; // 临时存储已获取的品牌对应厂商

  public vehicle_brand_id = ''; // 品牌

  public vehicle_firm_id = ''; // 厂商

  public vehicle_series_id = ''; // 车系

  private requestBrandSubscription: Subscription; // 获取品牌数据

  private requestFirmSubscription: Subscription; // 获取厂商数据

  private requestSeriesSubscription: Subscription; // 获取车系数据

  @Output('selectBrandFirmSeries') public selectBrandFirmSeries = new EventEmitter();

  constructor(
    private globalService: GlobalService,
    private vehicleService: VehicleTypeManagementService) { }

  public ngOnInit() {
    this.requestBrandList();
  }

  public ngOnDestroy() {
    this.requestBrandSubscription && this.requestBrandSubscription.unsubscribe();
    this.requestFirmSubscription && this.requestFirmSubscription.unsubscribe();
    this.requestSeriesSubscription && this.requestSeriesSubscription.unsubscribe();
  }

  // 获取品牌列表
  private requestBrandList() {
    this.requestBrandSubscription = this.vehicleService.requestVehicleBrandList().subscribe(res => {
      this.vehicleBrandList = res.results;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 根据品牌获取厂商列表
  private requestFirmListByBrand(vehicle_brand_id: string) {
    if (this.tmpMapOfFirm[vehicle_brand_id] && this.tmpMapOfFirm[vehicle_brand_id].length > 0) {
      this.vehicleFirmList = this.tmpMapOfFirm[vehicle_brand_id];
    } else {
      this.requestFirmSubscription = this.vehicleService.requestVehicleFirmList(vehicle_brand_id).subscribe(res => {
        this.vehicleFirmList = res;
        this.tmpMapOfFirm[vehicle_brand_id] = res;
      });
    }
  }

  // 根据厂商获取汽车车系
  private requestSeriesList(vehicle_firm_id: string) {
    if (this.tmpMapOfSeries[vehicle_firm_id] && this.tmpMapOfSeries[vehicle_firm_id].length > 0) {
      this.vehicleSeriesList = this.tmpMapOfSeries[vehicle_firm_id];
    } else {
      this.vehicleService.requestVehicleSeriesList(vehicle_firm_id).subscribe(res => {
        this.vehicleSeriesList = res;
        this.tmpMapOfSeries[vehicle_firm_id] = res;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 变更品牌
  public onChangeBrand(event: any) {
    if (event.target.value && !this.display_firm) {
      this.requestFirmListByBrand(event.target.value);
    } else {
      this.vehicle_firm_id = '';
      this.vehicleFirmList = [];
      this.vehicle_series_id = '';
      this.vehicleSeriesList = [];
    }
    this.sendEmitter();
  }

  // 变更厂商
  public onChangeFirm(event: any) {
    if (event.target.value && !this.display_series) {
      this.requestSeriesList(event.target.value);
    } else {
      this.vehicle_series_id = '';
      this.vehicleSeriesList = [];
    }
    this.sendEmitter();
  }

  // 变更车系
  public onChangeSeries(event: any) {
    this.sendEmitter();
  }

  // 回调
  private sendEmitter() {
    const emitter = {
      brand: this.vehicle_brand_id,
      firm: this.vehicle_firm_id,
      series: this.vehicle_series_id
    };
    if (!this.vehicle_brand_id) {
      emitter.brand = null;
    }
    if (!this.vehicle_firm_id) {
      emitter.firm = null;
    }
    if (!this.vehicle_series_id) {
      emitter.series = null;
    }
    timer(0).subscribe(() => {
      this.selectBrandFirmSeries.emit(emitter);
    });
  }
}
