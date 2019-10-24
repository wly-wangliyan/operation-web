import { GlobalService } from '../../../core/global.service';
import { Injectable } from '@angular/core';
import {
  VehicleBrandEntity,
  VehicleFirmEntity,
  VehicleSeriesEntity, VehicleTypeEntity,
  VehicleTypeManagementService
} from './vehicle-type-management.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeDataService {

  public vehicleBrandList: Array<VehicleBrandEntity> = [];
  public vehicleFirmList: Array<VehicleFirmEntity> = [];
  public vehicleSeriesList: Array<VehicleSeriesEntity> = [];
  public vehicleTypeList: Array<VehicleTypeEntity> = [];

  private tmpMapOfFirm: { [key: string]: Array<VehicleFirmEntity> } = {}; // 临时存储已获取的品牌对应厂商
  private tmpMapOfSeries: { [key: string]: Array<VehicleSeriesEntity> } = {}; // 临时存储已获取的厂商对应车系
  private tmpMapOfType: { [key: string]: Array<VehicleTypeEntity> } = {}; // 临时存储已获取的车系对应车型

  constructor(private globalService: GlobalService,
              private vehicleTypeManagementService: VehicleTypeManagementService) {
  }

  // 获取品牌列表
  public requestVehicleBrandList(param?: any) {
    if (this.vehicleBrandList.length > 0) {
      return;
    }
    this.vehicleTypeManagementService.requestVehicleBrandList(param).subscribe(res => {
      this.vehicleBrandList = res.results;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取厂商列表
  public requestVehicleFirmsList(vehicle_brand_id: string) {
    if (this.tmpMapOfFirm[vehicle_brand_id] && this.tmpMapOfFirm[vehicle_brand_id].length > 0) {
      this.vehicleFirmList = this.tmpMapOfFirm[vehicle_brand_id];
      return;
    }
    this.vehicleTypeManagementService.requestVehicleFirmList(vehicle_brand_id).subscribe(res => {
      this.vehicleFirmList = res;
      this.tmpMapOfFirm[vehicle_brand_id] = res;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 根据厂商获取汽车车系
  public requestVehicleSeriesList(vehicle_firm_id) {
    if (this.tmpMapOfSeries[vehicle_firm_id] && this.tmpMapOfSeries[vehicle_firm_id].length > 0) {
      this.vehicleSeriesList = this.tmpMapOfSeries[vehicle_firm_id];
      return;
    }
    this.vehicleTypeManagementService.requestVehicleSeriesList(vehicle_firm_id).subscribe(res => {
      this.vehicleSeriesList = res;
      this.tmpMapOfSeries[vehicle_firm_id] = res;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 根据车系获取汽车车型
  public requestVehicleTypeList(vehicle_series_id) {
    if (this.tmpMapOfType[vehicle_series_id] && this.tmpMapOfType[vehicle_series_id].length > 0) {
      this.vehicleTypeList = this.tmpMapOfType[vehicle_series_id];
      return;
    }
    this.vehicleTypeManagementService.requestVehicleTypeList(vehicle_series_id).subscribe(res => {
      this.vehicleTypeList = res;
      this.tmpMapOfType[vehicle_series_id] = res;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }
}

