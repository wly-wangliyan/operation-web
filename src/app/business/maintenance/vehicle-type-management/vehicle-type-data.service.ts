import { GlobalService } from '../../../core/global.service';
import { Injectable } from '@angular/core';
import {
  VehicleBrandEntity, VehicleBrandLinkResponse,
  VehicleFirmEntity,
  VehicleSeriesEntity, VehicleTypeEntity,
  VehicleTypeManagementService
} from './vehicle-type-management.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeDataService {

  public vehicleBrandList: Array<VehicleBrandEntity> = [];
  public vehicleFirmList: Array<VehicleFirmEntity> = [];
  public vehicleSeriesList: Array<VehicleSeriesEntity> = [];
  public vehicleTypeList: Array<VehicleTypeEntity> = [];

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
    if (this.vehicleFirmList.length > 0) {
      return;
    }
    this.vehicleTypeManagementService.requestVehicleFirmList(vehicle_brand_id).subscribe(res => {
      this.vehicleFirmList = res;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 根据厂商获取汽车车系
  public requestVehicleSeriesList(vehicle_firm_id) {
    if (this.vehicleSeriesList.length > 0) {
      return;
    }
    this.vehicleTypeManagementService.requestVehicleSeriesList(vehicle_firm_id).subscribe(res => {
      this.vehicleSeriesList = res;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 根据车系获取汽车车型
  public requestVehicleTypeList(vehicle_series_id) {
    if (this.vehicleTypeList.length > 0) {
      return;
    }
    this.vehicleTypeManagementService.requestVehicleTypeList(vehicle_series_id).subscribe(res => {
      this.vehicleTypeList = res;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }
}

