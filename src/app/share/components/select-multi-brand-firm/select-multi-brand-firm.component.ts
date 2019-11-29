import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import {
  VehicleTypeManagementService,
  VehicleBrandEntity,
  VehicleFirmEntity,
  VehicleSeriesEntity
} from '../../../operational-system/maintenance/vehicle-type-management/vehicle-type-management.service';
import { NzFormatEmitEvent } from 'ng-zorro-antd/core';

@Component({
  selector: 'app-select-multi-brand-firm',
  templateUrl: './select-multi-brand-firm.component.html',
  styleUrls: ['./select-multi-brand-firm.component.css']
})
export class SelectMultiBrandFirmComponent implements OnInit {

  constructor(
    private globalService: GlobalService,
    private vehicleService: VehicleTypeManagementService) { }

  public letter_list = [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  public vehicleBrandList: Array<VehicleBrandEntity> = []; // 车辆品牌列表

  public vehicleBrandTreeList: Array<any> = []; // 树结构展示的车辆品牌列表

  public vehicleFirmList: Array<VehicleFirmEntity> = []; // 厂商列表

  public vehicleSeriesList: Array<VehicleSeriesEntity> = []; // 车系列表

  public mapOfBrand: { [key: string]: Array<VehicleBrandEntity> } = {}; // 字母对应品牌

  public defaultSelectedKeys = ['8e568e2adb5511e9a5290242ac150003', '8e6ee9f2db5511e9a5290242ac150003'];

  private requestBrandSubscription: Subscription; // 获取品牌数据

  private requestFirmSubscription: Subscription; // 获取厂商数据

  public ngOnInit() {
  }

  /**
   * 打开
   */
  public open() {
    setTimeout(() => {
      this.initModal();
      $('#selectMultiBrandFirmModal').modal();
      this.requestBrandList();
    }, 0);
  }

  /**
   * 关闭
   */
  public close() {
    this.requestBrandSubscription && this.requestBrandSubscription.unsubscribe();
    this.requestFirmSubscription && this.requestFirmSubscription.unsubscribe();
    $('#selectMultiBrandFirmModal').modal('hide');
  }

  // 初始化
  private initModal() {
    this.vehicleBrandList = [];
    this.vehicleBrandTreeList = [];
    this.vehicleFirmList = [];
    this.vehicleSeriesList = [];
  }

  // 获取品牌列表
  private requestBrandList() {
    this.requestBrandSubscription = this.vehicleService.requestVehicleBrandList().subscribe(res => {
      this.vehicleBrandList = res.results;
      this.vehicleBrandTreeList = res.results.map(i => ({ ...i, key: i.vehicle_brand_id, title: i.vehicle_brand_name }));
      this.letter_list.forEach(leter => {
        this.mapOfBrand[leter] = this.vehicleBrandTreeList.filter(brand => brand.vehicle_brand_initial === leter);
      });
    }, err => {
      $('#selectMultiBrandFirmModal').modal('hide');
      this.globalService.httpErrorProcess(err);
    });
  }

  // 加载下级菜单
  nzEvent(event: Required<NzFormatEmitEvent>): void {
    if (event.eventName === 'expand') {
      const node = event.node;
      if (node && node.getChildren().length === 0 && node.isExpanded) {
        if (node.level === 0) {
          // 根据品牌获取厂商
          this.requestFirmListByBrand(node);
        } else if (node.level === 1) {
          // 根据厂商获取汽车车系
          this.requestSeriesListByFirm(node);
        }
      }
    }
  }

  // 复选>选中父级默认勾选子级
  nzCheck(event: Required<NzFormatEmitEvent>): void {
    if (event.eventName === 'check') {
      const node = event.node;
      if (node && node.getChildren().length === 0 && !node.isExpanded) {
        if (node.level === 0) {
          // 根据品牌获取厂商和车系
          this.requestFirmAndSeriesList(node);
        }
      }
    }
  }

  // 获取对应厂商列表
  private requestFirmListByBrand(node) {
    const vehicle_brand_id = node.origin.vehicle_brand_id;
    this.vehicleService.requestVehicleFirmList(vehicle_brand_id).subscribe(res => {
      this.vehicleFirmList = res;
      const newVehicleFirmList = res.map(i => ({ ...i, key: i.vehicle_firm_id, title: i.vehicle_firm_name }));
      node.addChildren(newVehicleFirmList);
    }, err => {
      this.vehicleFirmList = [];
      $('#selectMultiBrandFirmModal').modal('hide');
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取对应车系列表
  private requestSeriesListByFirm(node) {
    const vehicle_firm_id = node.origin.vehicle_firm_id;
    this.vehicleService.requestVehicleSeriesList(vehicle_firm_id).subscribe(res => {
      this.vehicleSeriesList = res;
      const newVehicleSeriesList = res.map(i => ({ ...i, isLeaf: true, key: i.vehicle_series_id, title: i.vehicle_series_name }));
      node.addChildren(newVehicleSeriesList);
      if (node.isChecked && node.children.length !== 0) {
        node.children.forEach(i => {
          i.isChecked = true;
        });
      }
    }, err => {
      this.vehicleSeriesList = [];
      $('#selectMultiBrandFirmModal').modal('hide');
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取对应厂商以及车系列表
  private requestFirmAndSeriesList(node) {
    const vehicle_brand_id = node.origin.vehicle_brand_id;
    this.vehicleService.requestVehicleFirmList(vehicle_brand_id).subscribe(res => {
      this.vehicleFirmList = res;
      const newVehicleFirmList = res.map(i => ({ ...i, key: i.vehicle_firm_id, title: i.vehicle_firm_name }));
      node.addChildren(newVehicleFirmList);
      if (node.children.length !== 0) {
        node.children.forEach(i => {
          i.isChecked = true;
          this.requestSeriesListByFirm(i);
        });
      }
    }, err => {
      this.vehicleFirmList = [];
      $('#selectMultiBrandFirmModal').modal('hide');
      this.globalService.httpErrorProcess(err);
    });
  }

}

