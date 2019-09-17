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
  public disabled = false;
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

  @Input() private selectedBrand: string; // 已选中的品牌

  @Input() private selectedFirm: string; // 已选中的厂商

  @Input() private multi = true; // 标记厂商是否多选

  @Input() private isDisabled = false; // 标记是否对厂商禁用

  public vehicleBrandList: Array<VehicleBrandEntity> = []; // 车辆品牌列表

  public mapOfBrand: { [key: string]: Array<VehicleBrandEntity> } = {}; // 字母对应品牌

  public currentBrand: VehicleBrandEntity = new VehicleBrandEntity(); // 选中品牌

  public vehicleFirmItem: Array<VehicleFirmItem> = []; // 格式化后厂商元素

  public mapOfFirm: { [key: string]: Array<VehicleFirmItem> } = {}; // 临时存储已获取的品牌对应厂商

  private requestBrandSubscription: Subscription; // 获取品牌数据

  private requestFirmSubscription: Subscription; // 获取厂商数据

  // private isFirstRender = true; // 用于标记第一次渲染已勾选厂商

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
    this.mapOfFirm = {};
    this.currentBrand = new VehicleBrandEntity();
  }

  // 获取品牌列表
  private requestBrandList() {
    this.requestBrandSubscription = this.vehicleService.requestVehicleBrandList().subscribe(res => {
      this.vehicleBrandList = res.results;
      this.letter_list.forEach(leter => {
        this.mapOfBrand[leter] = this.vehicleBrandList.filter(brand => brand.vehicle_brand_initial === leter);
      });
      if (!this.multi && this.selectedBrand) {
        const brandList = this.vehicleBrandList.filter(brand => brand.vehicle_brand_id === this.selectedBrand);
        if (brandList && brandList.length > 0) {
          this.currentBrand = brandList[0];
          this.requestFirmListByBrand(this.currentBrand.vehicle_brand_id);
        }
      } else if (this.multi && this.selectedBrand) {
        const brands = this.selectedBrand.split(',');
        if (brands && brands.length > 0) {
          brands.forEach(brandId => {
            const isfindIndex = this.vehicleBrandList.some(brand => brand.vehicle_brand_id === brandId);
            if (isfindIndex) {
              this.requestFirmListByBrand(brandId);
            }
          });
        }
      }
    }, err => {
      $('#selectBrandFirmModal').modal('hide');
      this.globalService.httpErrorProcess(err);
    });
  }

  // 选中品牌
  public onBrandClick(vehicleBrand: VehicleBrandEntity) {
    this.tipMsg = '';
    this.currentBrand = vehicleBrand;
    if (!this.multi) {
      for (const firmItem in this.mapOfFirm) {
        if (this.mapOfFirm.hasOwnProperty(firmItem)) {
          if (firmItem !== vehicleBrand.vehicle_brand_id) {
            this.mapOfFirm[firmItem].forEach(item => item.checked = false);
          }
        }
      }
    }
    this.requestFirmListByBrand(vehicleBrand.vehicle_brand_id);
  }

  // 勾选厂商
  public onChangeFirmCheck(vehicleFirm: VehicleFirmItem) {
    this.tipMsg = '';
    if (vehicleFirm.checked) {
      if (!this.multi) {
        this.vehicleFirmItem.forEach(item => {
          if (item.source.vehicle_firm_id !== vehicleFirm.source.vehicle_firm_id) {
            item.checked = false;
          }
        });
      }
    }
    this.mapOfFirm[vehicleFirm.source.vehicle_brand.vehicle_brand_id] = this.vehicleFirmItem;
  }

  // 获取对应厂商列表
  private requestFirmListByBrand(vehicle_brand_id: string) {
    if (this.mapOfFirm[vehicle_brand_id] && this.mapOfFirm[vehicle_brand_id].length > 0) {
      this.vehicleFirmItem = this.mapOfFirm[vehicle_brand_id];
    } else {
      this.vehicleService.requestVehicleFirmList(vehicle_brand_id).subscribe(res => {
        const vehicleFirmList: Array<VehicleFirmEntity> = res ? res : []; // 车辆品牌厂商
        const vehicleFirmItem = [];
        let fiems = [];

        if (this.selectedFirm) {
          fiems = this.selectedFirm.split(',');
        }
        vehicleFirmList.forEach(item => {
          const firmItem = new VehicleFirmItem(item);
          // 首次加载渲染已勾选厂商
          if (fiems.indexOf(item.vehicle_firm_id) !== -1) {
            firmItem.checked = true;
            if (this.isDisabled) {
              firmItem.disabled = true;
            }
            this.currentBrand = item.vehicle_brand;
          }
          vehicleFirmItem.push(firmItem);
        });
        this.vehicleFirmItem = vehicleFirmItem;
        this.mapOfFirm[vehicle_brand_id] = vehicleFirmItem;
      }, err => {
        this.vehicleFirmItem = [];
        $('#selectBrandFirmModal').modal('hide');
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 回传选中事件
  public onSelectEmit() {
    const firmItem_checked = [];
    for (const i in this.mapOfFirm) {
      if (this.mapOfFirm.hasOwnProperty(i)) {
        this.mapOfFirm[i].forEach(firm => {
          if (firm.checked && !firm.disabled) {
            firmItem_checked.push(firm.source);
          }
        });
      }
    }
    if (firmItem_checked.length > 0) {
      this.selectBrandFirm.emit({ firm: firmItem_checked });
      $('#selectBrandFirmModal').modal('hide');
    } else {
      this.tipMsg = '请选择厂商';
    }
  }
}
