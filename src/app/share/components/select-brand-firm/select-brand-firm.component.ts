import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import {
  VehicleTypeManagementService,
  VehicleBrandEntity,
  VehicleFirmEntity
} from '../../../business/maintenance/vehicle-type-management/vehicle-type-management.service';

class VehicleFirmItem {
  public checked = false;
  public source: VehicleFirmEntity;

  constructor(source: VehicleFirmEntity) {
    this.source = source;
  }
}

@Component({
  selector: 'app-select-brand-firm',
  templateUrl: './select-brand-firm.component.html',
  styleUrls: ['./select-brand-firm.component.css']
})
export class SelectBrandFirmComponent implements OnInit {

  public letter_list = [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  @Input() private selectedBrand: number; // 已选中的品牌

  @Input() private selectedFirm: string; // 已选中的厂商

  @Input() private multi = false; // 标记厂商是否多选

  public vehicleBrandList: Array<VehicleBrandEntity> = []; // 车辆品牌列表

  public mapOfBrand: { [key: string]: Array<VehicleBrandEntity> } = {}; // 字母对应品牌

  public currentBrand: VehicleBrandEntity = new VehicleBrandEntity(); // 选中品牌

  public vehicleFirmList: Array<VehicleFirmEntity> = []; // 车辆品牌厂商

  public vehicleFirmItem: Array<VehicleFirmItem> = []; // 格式化后厂商元素

  private requestBrandSubscription: Subscription; // 获取品牌数据

  private requestFirmSubscription: Subscription; // 获取厂商数据

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
    this.requestFirmListByBrand(vehicleBrand.vehicle_brand_id);
  }

  // 勾选厂商
  public onChangeFirmCheck(vehicleFirm: VehicleFirmItem) {
    if (vehicleFirm.checked) {
      if (!this.multi) {
        this.vehicleFirmItem.forEach(item => {
          if (item.source.vehicle_firm_id !== vehicleFirm.source.vehicle_firm_id) {
            item.checked = false;
          }
        });
      }
    }
  }

  // 获取对应厂商列表
  private requestFirmListByBrand(vehicle_brand_id: string) {
    this.vehicleService.requestVehicleFirmList(vehicle_brand_id).subscribe(res => {
      this.vehicleFirmList = res;
      const vehicleFirmItem = [];
      this.vehicleFirmList.forEach(item => {
        const firmItem = new VehicleFirmItem(item);
        vehicleFirmItem.push(firmItem);
      });
      this.vehicleFirmItem = vehicleFirmItem;
    }, err => {
      this.vehicleFirmItem = [];
      $('#selectBrandFirmModal').modal('hide');
      this.globalService.httpErrorProcess(err);
    });
  }

  // 回传选中事件
  public onSelectEmit() {
    const firmItem = this.vehicleFirmItem.filter(item => item.checked);
    if (firmItem.length > 0) {
      this.selectBrandFirm.emit({ firm: firmItem });
      $('#selectBrandFirmModal').modal('hide');
    } else {
      this.tipMsg = '请选择厂商';
    }
  }
}
