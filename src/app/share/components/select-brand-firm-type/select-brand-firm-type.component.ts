import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import {
  VehicleTypeManagementService,
  VehicleBrandEntity,
  VehicleFirmEntity, VehicleTypeEntity, VehicleSeriesEntity
} from '../../../business/maintenance/vehicle-type-management/vehicle-type-management.service';

class VehicleFirmItem {
  public checked = false;
  public source: VehicleFirmEntity;

  constructor(source: VehicleFirmEntity) {
    this.source = source;
  }
}

class VehicleSeriesItem {
  public checked = false;
  public source: VehicleSeriesEntity;

  constructor(source: VehicleSeriesEntity) {
    this.source = source;
  }
}

class VehicleTypeItem {
  public checked = false;
  public source: VehicleTypeEntity;

  constructor(source: VehicleTypeEntity) {
    this.source = source;
  }
}

@Component({
  selector: 'app-select-brand-firm-type',
  templateUrl: './select-brand-firm-type.component.html',
  styleUrls: ['./select-brand-firm-type.component.css']
})
export class SelectBrandFirmTypeComponent implements OnInit {

  public letter_list = [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  @Input() private selectedBrand: number; // 已选中的品牌

  @Input() private selectedFirm: string; // 已选中的厂商

  @Input() private multi = false; // 标记厂商是否多选

  public vehicleBrandList: Array<VehicleBrandEntity> = []; // 车辆品牌列表

  public currentBrand: VehicleBrandEntity = new VehicleBrandEntity(); // 选中品牌

  public mapOfBrand: { [key: string]: Array<VehicleBrandEntity> } = {}; // 字母对应品牌

  public vehicleFirmList: Array<VehicleFirmEntity> = []; // 车辆品牌厂商

  public vehicleFirmItem: Array<VehicleFirmItem> = []; // 格式化后厂商元素

  public vehicleSeriesList: Array<VehicleSeriesEntity> = []; // 车辆品牌厂商

  public vehicleSeriesItem: Array<VehicleSeriesItem> = []; // 格式化后厂商元素

  public currentSeries: VehicleSeriesEntity = new VehicleSeriesEntity(); // 选中品牌

  public vehicleTypeList: Array<VehicleTypeEntity> = []; // 车辆品牌厂商

  public vehicleTypeItem: Array<VehicleTypeItem> = []; // 格式化后厂商元素

  public currentType: VehicleTypeEntity = new VehicleTypeEntity(); // 选中品牌

  private requestBrandSubscription: Subscription; // 获取品牌数据

  private requestFirmSubscription: Subscription; // 获取厂商数据

  private requestSeriesSubscription: Subscription; // 获取厂商数据

  private requestTypeSubscription: Subscription; // 获取厂商数据

  public tipMsg = ''; // 提示信息

  @Output('selectBrandFirm') public selectBrandFirm = new EventEmitter();

  constructor(
    private globalService: GlobalService,
    private vehicleService: VehicleTypeManagementService) { }

  public ngOnInit() {
  }

  /**
   * 打开
   */
  public open() {
    setTimeout(() => {
      this.initModal();
      $('#selectBrandFirmModal').modal();
      this.requestBrandList();
    }, 0);
  }

  /**
   * 关闭
   */
  public close() {
    this.requestBrandSubscription && this.requestBrandSubscription.unsubscribe();
    this.requestFirmSubscription && this.requestFirmSubscription.unsubscribe();
    $('#selectBrandFirmModal').modal('hide');
  }

  // 初始化
  private initModal() {
    this.tipMsg = '';
    this.vehicleBrandList = [];
    this.vehicleFirmItem = [];
    this.currentBrand = new VehicleBrandEntity();
  }

  // 获取品牌列表
  private requestBrandList() {
    this.requestBrandSubscription = this.vehicleService.requestVehicleBrandList().subscribe(res => {
      this.vehicleBrandList = res.results;
      this.letter_list.forEach(leter => {
        this.mapOfBrand[leter] = this.vehicleBrandList.filter(brand => brand.vehicle_brand_initial === leter);
      });
    }, err => {
      $('#selectBrandFirmModal').modal('hide');
      this.globalService.httpErrorProcess(err);
    });
  }

  // 选中品牌
  public onBrandClick(vehicleBrand: VehicleBrandEntity) {
    this.currentBrand = vehicleBrand;
    this.requestFirmSeriesListByBrand(vehicleBrand.vehicle_brand_id);
  }

  // 勾选车系
  public onChangeSeriesCheck(vehicleSeries: VehicleSeriesEntity) {
    this.currentSeries = vehicleSeries;
    this.requestTypeList(vehicleSeries.vehicle_series_id);
  }

  // 勾选车型
  public onChangeTypeCheck(vehicleType: VehicleTypeEntity) {
    this.currentType = vehicleType;
  }

  // 获取对应厂商车系列表
  private requestFirmSeriesListByBrand(vehicle_brand_id: string) {
    this.vehicleService.requestVehicleSeriesListByBrand(vehicle_brand_id).subscribe(res => {
      this.vehicleSeriesList = res;
      const vehicleSeriesItem = [];
      this.vehicleSeriesList.forEach(item => {
        const seriesItem = new VehicleSeriesItem(item);
        vehicleSeriesItem.push(seriesItem);
      });
      this.vehicleSeriesItem = vehicleSeriesItem;
    }, err => {
      this.vehicleSeriesItem = [];
      $('#selectBrandFirmModal').modal('hide');
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取对应车型列表
  private requestTypeList(vehicle_series_id: string) {
    this.vehicleService.requestVehicleTypeList(vehicle_series_id).subscribe(res => {
      this.vehicleTypeList = res;
      const vehicleTypeItem = [];
      this.vehicleTypeList.forEach(item => {
        const typeItem = new VehicleTypeItem(item);
        vehicleTypeItem.push(typeItem);
      });
      this.vehicleTypeItem = vehicleTypeItem;
    }, err => {
      this.vehicleTypeItem = [];
      $('#selectBrandFirmModal').modal('hide');
      this.globalService.httpErrorProcess(err);
    });
  }

  // 回传选中事件
  public onSelectEmit() {
    // const firmItem = this.vehicleFirmItem.filter(item => item.checked);
    /*if (firmItem.length > 0) {
      this.selectBrandFirm.emit({ firm: firmItem });
      $('#selectBrandFirmModal').modal('hide');
    } else {
      this.tipMsg = '请选择厂商';
    }*/
    this.selectBrandFirm.emit({ vehicle_type: this.currentType });
    $('#selectBrandFirmModal').modal('hide');
  }
}
