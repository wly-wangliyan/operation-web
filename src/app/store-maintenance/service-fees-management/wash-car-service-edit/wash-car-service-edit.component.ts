import { Component, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import {
  WashCarServiceConfigService,
  WashCarServiceConfigEntity,
  WashCarSpecificationEntity,
  BasePriceEntity,
} from '../wash-car-service-config.service';
import { Subject, Subscription, forkJoin } from 'rxjs/index';
import { GlobalService } from '../../../core/global.service';
import { HttpErrorEntity } from '../../../core/http.service';
import { RepairShopEntity } from '../../garage-management/garage-management.service';
@Component({
  selector: 'app-wash-car-service-edit',
  templateUrl: './wash-car-service-edit.component.html',
  styleUrls: ['./wash-car-service-edit.component.css', '../../../../assets/less/tab-bar-list.less']
})
export class WashCarServiceEditComponent implements OnInit {
  public loading = false; // 标记loading
  public washServiceConfig: WashCarServiceConfigEntity = new WashCarServiceConfigEntity(); // 洗车服务配置
  public specificationList: Array<WashCarSpecificationEntity> = []; // 规格
  public basePrice: Array<BasePriceEntity> = []; // 基础价格
  public basePrice_1: Array<BasePriceEntity> = []; // 标准洗车1次 基础价格
  public basePrice_2: Array<BasePriceEntity> = []; // 标准洗车1次+打蜡1次 基础价格
  public repairShopList: Array<RepairShopEntity> = []; // 通用门店列表
  public removeList: Array<WashCarSpecificationEntity> = []; // 移除的已有规格
  public selectedTabIndex = 1;
  public tabs = [{ key: 1, value: '5座小型车' }, { key: 2, value: 'SUV/MPV' }];
  public basePriceErrMsg = '';
  public specificationErrMsg = '';
  public tempSpecificationList_1: Array<WashCarSpecificationEntity> = []; // 临时存储5座小型车规格
  public tempSpecificationList_2: Array<WashCarSpecificationEntity> = []; // 临时存储SUV/MPV规格
  private sort = 0;
  private searchText$ = new Subject<any>();
  constructor(private globalService: GlobalService, private washCarService: WashCarServiceConfigService) { }

  public ngOnInit() {
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.getDetailData();
    }, err => {

    });
    this.searchText$.next();
  }

  private getDetailData() {
    forkJoin(this.washCarService.requestWashCarServiceConfigData(),
      this.washCarService.requestRepairShopData()).subscribe(res => {
        this.washServiceConfig = res[0];
        this.washServiceConfig.base_price_info = res[0].base_price_info ? res[0].base_price_info : [];
        this.initBasePrice();
        this.washServiceConfig.specification_info = res[0].specification_info ? res[0].specification_info : [];
        this.calculateSpecificationPrice(this.washServiceConfig.specification_info);
        this.initSpecification();
        this.repairShopList = res[1];
      });
  }

  private initBasePrice() {
    this.washServiceConfig.base_price_info.forEach(price => {
      price.original_unit_fee = price.original_unit_fee / 100 || null;
      price.buy_unit_fee = price.buy_unit_fee / 100 || null;
    });
    this.basePrice_1 = this.washServiceConfig.base_price_info.filter(price => price.service_type === 1);
    this.basePrice_2 = this.washServiceConfig.base_price_info.filter(price => price.service_type === 2);
  }

  /**
   * 列表规格原价数据计算
   * 原价= 标准洗车原价×标准洗车次数 +（标准洗车+打蜡次数原价）×（标准洗车+打蜡次数）
   */
  public calculateSpecificationPrice(specification_info: Array<WashCarSpecificationEntity>) {
    specification_info.forEach(item => {
      this.sort++;
      item.time = this.sort;
      const base_price = this.washServiceConfig.base_price_info.filter(price => price.car_type === item.car_type);
      const service_type_1 = this.basePrice_1.filter(price => price.car_type === item.car_type);
      const service_type_2 = this.basePrice_2.filter(price => price.car_type === item.car_type);
      if (base_price && base_price.length > 0) {
        if (service_type_1) {
          item.original_fee = (item.base_num || 0) * service_type_1[0].original_unit_fee;
        }
        if (service_type_2) {
          item.original_fee += (item.base_wax_num || 0) * service_type_2[0].original_unit_fee;
        }
      }
      if (isNaN(item.original_fee)) {
        item.original_fee = null;
      } else {
        item.original_fee = Number(item.original_fee.toFixed(2));
      }
    });
    console.log(2, specification_info);
  }

  // 初始化规格信息
  private initSpecification(): void {
    this.specificationList = [];
    if (!this.washServiceConfig.specification_info || this.washServiceConfig.specification_info.length === 0
      || !this.washServiceConfig.specification_info.some(specification => specification.car_type === this.selectedTabIndex)) {
      this.sort++;
      const specification = new WashCarSpecificationEntity();
      specification.time = this.sort;
      specification.car_type = this.selectedTabIndex;
      this.specificationList.push(new WashCarSpecificationEntity());
    } else {
      const specificationList = this.washServiceConfig.specification_info
        .filter(specification => specification.car_type === this.selectedTabIndex);
      specificationList.forEach(specification => {
        this.specificationList.push(specification.clone());
      });
    }
  }

  public onTabChange(event: any): void {
    if (event === 1) {
      this.tempSpecificationList_2 = [];
      this.specificationList.forEach(specification => {
        this.tempSpecificationList_2.push(specification.clone());
      });
      this.specificationList = [];
      this.tempSpecificationList_1.forEach(tempItem => {
        this.specificationList.push(tempItem.clone());
      });
    } else if (event === 2) {
      if (!this.tempSpecificationList_2 || this.tempSpecificationList_2.length === 0) {
        const specificationList = this.washServiceConfig.specification_info
          .filter(specification => specification.car_type === 2);
        if (!specificationList || specificationList.length === 0) {
          this.sort++;
          const specification = new WashCarSpecificationEntity();
          specification.time = this.sort;
          specification.car_type = this.selectedTabIndex;
          this.specificationList.push(new WashCarSpecificationEntity());
        } else {
          specificationList.forEach(specification => {
            this.tempSpecificationList_2.push(specification.clone());
          });
        }
      }
      this.tempSpecificationList_1 = [];
      this.specificationList.forEach(specification => {
        this.tempSpecificationList_1.push(specification.clone());
      });
      this.specificationList = [];
      this.tempSpecificationList_2.forEach(tempItem => {
        this.specificationList.push(tempItem.clone());
      });
    }
    this.calculateSpecificationPrice(this.specificationList);
  }

  public onAddClick(): void {
    this.sort++;
    this.specificationErrMsg = '';
    const item = new WashCarSpecificationEntity();
    item.time = this.sort;
    item.car_type = this.selectedTabIndex;
    this.specificationList.push(item);
  }

  // 移除规格
  public onDeleteClick(data: WashCarSpecificationEntity, index: number): void {
    this.specificationErrMsg = '';
    const wash_car_specification_id = data.wash_car_specification_id;
    if (wash_car_specification_id) {
      data.is_deleted = true;
      this.removeList.push(data.clone());
    }
    this.specificationList.splice(index, 1);
  }

  public onPriceChange() {
    console.log('change');
    this.calculateSpecificationPrice(this.specificationList);
  }
}
