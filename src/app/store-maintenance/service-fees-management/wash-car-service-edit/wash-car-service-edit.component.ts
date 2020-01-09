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
import { DisabledTimeHelper } from '../../../../utils/disabled-time-helper';
@Component({
  selector: 'app-wash-car-service-edit',
  templateUrl: './wash-car-service-edit.component.html',
  styleUrls: ['./wash-car-service-edit.component.css', '../../../../assets/less/tab-bar-list.less']
})
export class WashCarServiceEditComponent implements OnInit {
  public loading = true; // 标记loading
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
  private tempSpecificationNameList: Array<any> = []; // 临时存储规格名称
  private selectedSpecification: WashCarSpecificationEntity = new WashCarSpecificationEntity();
  private editParams: WashCarServiceConfigEntity = new WashCarServiceConfigEntity(); // 保存参数
  private sort = 0;
  private searchText$ = new Subject<any>();
  constructor(private globalService: GlobalService, private washCarService: WashCarServiceConfigService) { }

  public ngOnInit() {
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.getDetailData();
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
    this.selectedSpecification.valid_date_start = '';
    this.selectedSpecification.valid_date_end = '';
  }

  private getDetailData() {
    forkJoin(this.washCarService.requestWashCarServiceConfigData(),
      this.washCarService.requestRepairShopData()).subscribe(res => {
        this.washServiceConfig = res[0];
        this.washServiceConfig.base_price_info = res[0].base_price_info ? res[0].base_price_info : [];
        this.initBasePrice();
        this.washServiceConfig.specification_info = res[0].specification_info ? res[0].specification_info : [];
        this.calculateSpecificationPrice(this.washServiceConfig.specification_info, true);
        this.initSpecification();
        // this.repairShopList = res[1];
        this.loading = false;
      }, err => {
        this.loading = false;
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 404) {
            this.globalService.promptBox.open('服务配置不存在，请刷新重试!', null, 2000, null, false);
          }
        }
      });
  }

  private initBasePrice() {
    this.washServiceConfig.base_price_info.forEach(price => {
      price.original_unit_fee = Number((price.original_unit_fee / 100).toFixed(2)) || null;
      price.buy_unit_fee = Number((price.buy_unit_fee / 100).toFixed(2)) || null;
    });
    this.basePrice_1 = this.washServiceConfig.base_price_info.filter(price => price.service_type === 1);
    this.basePrice_2 = this.washServiceConfig.base_price_info.filter(price => price.service_type === 2);
  }

  /**
   * 列表规格原价数据计算
   * 原价= 标准洗车原价×标准洗车次数 +（标准洗车+打蜡次数原价）×（标准洗车+打蜡次数）
   */
  public calculateSpecificationPrice(specification_info: Array<WashCarSpecificationEntity>, valid_fomat = false) {
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
      if (valid_fomat && item.valid_date_type === 2) {
        item.valid_date_start = item.valid_date_start * 1000;
        item.valid_date_end = item.valid_date_end * 1000;
      }
    });
  }

  // 初始化规格信息
  private initSpecification(): void {
    this.specificationList = [];
    if (this.washServiceConfig.specification_info.length === 0
      || !this.washServiceConfig.specification_info.some(specification => specification.car_type === 1)) {
      this.sort++;
      const specification = new WashCarSpecificationEntity();
      specification.time = this.sort;
      specification.car_type = 1;
      this.specificationList.push(specification);
    } else {
      const specificationList = this.washServiceConfig.specification_info
        .filter(specification => specification.car_type === 1);
      specificationList.forEach(specification => {
        this.specificationList.push(specification.clone());
      });
    }
    if (!this.washServiceConfig.specification_info.some(item => item.car_type === 2)) {
      this.sort++;
      const specification_2 = new WashCarSpecificationEntity();
      specification_2.time = this.sort;
      specification_2.car_type = 2;
      this.tempSpecificationList_2.push(specification_2);
    } else {
      const specificationList_2 = this.washServiceConfig.specification_info
        .filter(specification => specification.car_type === 2);
      specificationList_2.forEach(specification => {
        this.tempSpecificationList_2.push(specification.clone());
      });
    }
  }

  public onTabChange(event: any): void {
    $('.table-scroll').scrollLeft(0);
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

  // 原价数据联动
  public onPriceChange() {
    this.calculateSpecificationPrice(this.specificationList);
  }

  // 切换有效期
  public onChangeValidDateType(data: WashCarSpecificationEntity, valid_date_type: number): void {
    this.specificationErrMsg = '';
    data.valid_date_type = valid_date_type;
    data.valid_date_start = '';
    data.valid_date_end = '';
    data.valid_period = null;
    data.valid_period_unit = null;
    if (valid_date_type === 1) {
      data.valid_period_unit = 'day';
    }
  }

  public onOpenChange(event: any, data: WashCarSpecificationEntity): void {
    if (event) {
      if (data.valid_date_start) {
        this.selectedSpecification.valid_date_start = data.clone().valid_date_start;
      } else {
        this.selectedSpecification.valid_date_start = '';
      }

      if (data.valid_date_end) {
        this.selectedSpecification.valid_date_end = data.clone().valid_date_end;
      } else {
        this.selectedSpecification.valid_date_end = '';
      }
    }
  }
  // 处理有效期开始时间为 00:00:00
  public onValidStartChange(event: any, data: WashCarSpecificationEntity) {
    this.specificationErrMsg = '';
    data.valid_date_start = event ? new Date(event).setHours(0, 0, 0, 0) : '';
  }
  // 处理有效期结束时间为 23:59:59
  public onValidEndChange(event: any, data: WashCarSpecificationEntity) {
    this.specificationErrMsg = '';
    data.valid_date_end = event ? new Date(event).setHours(23, 59, 59, 0) : '';
  }

  // 有效期开始时间的禁用部分
  public disabledValidStartTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledFutureStartTime(startValue, this.selectedSpecification.valid_date_end);
  }

  // 有效期结束时间的禁用部分
  public disabledValidEndTime = (endValue: Date): boolean => {
    return DisabledTimeHelper.disabledFutureEndTime(endValue, this.selectedSpecification.valid_date_start);
  }

  // 取消
  public onCancelClick(): void {
    window.history.back();
  }

  public onFormSubmit(): void {
    if (this.generateAndCheckParamsValid()) {
      console.log('8888');
    }
  }

  private generateAndCheckParamsValid(): boolean {
    this.editParams = new WashCarServiceConfigEntity();
    // 校验基础价格
    let result = true;
    this.basePrice_1.forEach((price, index) => {
      if (price.original_unit_fee < price.buy_unit_fee) {
        if (price.car_type === 1) {
          this.basePriceErrMsg = `1次标准洗车-5座小型车：结算价应小于等于单价！`;
        } else {
          this.basePriceErrMsg = `1次标准洗车-SUV/MPV：结算价应小于等于单价！`;
        }
        result = false;
        return;
      }
      this.editParams.base_price_info.push(price.toEditJson());
    });
    if (!result) {
      return false;
    }
    console.log(2, this.basePrice_2);
    this.basePrice_2.forEach((price, index) => {
      if (price.original_unit_fee < price.buy_unit_fee) {
        if (price.car_type === 1) {
          this.basePriceErrMsg = `(1次标准洗车+1次打蜡)-5座小型车：结算价应小于等于单价！`;
        } else {
          this.basePriceErrMsg = `(1次标准洗车+1次打蜡)-SUV/MPV：结算价应小于等于单价！`;
        }
        result = false;
        return;
      }
      this.editParams.base_price_info.push(price.toEditJson());
    });
    console.log(this.editParams);
    if (!result) {
      return false;
    }
    let car_name = this.selectedTabIndex === 1 ? '5座小型车' : 'SUV/MPV';
    const validSpecification = this.selectedTabIndex === 1 ? this.tempSpecificationList_2 : this.tempSpecificationList_1;
    // 校验规格设置
    this.tempSpecificationNameList = [];
    this.specificationList.forEach((specification, index) => {
      if (this.tempSpecificationNameList.includes(specification.specification_name)) {
        this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-规格名称重复！`;
        result = false;
        return;
      } else if (!specification.base_num && !specification.base_wax_num) {
        this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-规格配置之和至少等于1！`;
        result = false;
        return;
      } else if (!specification.sale_fee) {
        this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-售价应大于0！`;
        result = false;
        return;
      } else if (specification.original_fee < specification.sale_fee) {
        this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-售价应小于等于原价！`;
        result = false;
        return;
      } else if (!specification.valid_date_type) {
        this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-请选择有效期类型！`;
        result = false;
        return;
      } else {
        if (specification.valid_date_type === 1 && !specification.valid_period) {
          this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-有效期时长应大于0！`;
          result = false;
          return;
        } else if (specification.valid_date_type === 2) {
          if (!specification.valid_date_start) {
            this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-请选择有效期开始日期！`;
            result = false;
            return;
          } else if (!specification.valid_date_end) {
            this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-请选择有效期结束日期！`;
            result = false;
            return;
          }
        }
      }
      if (result) {
        this.tempSpecificationNameList.push(specification.specification_name);
      }
    });
    if (!result) {
      return false;
    }
    car_name = this.selectedTabIndex === 1 ? 'SUV/MPV' : '5座小型车';

    // 校验规格设置
    this.tempSpecificationNameList = [];
    validSpecification.forEach((specification, index) => {
      if (this.tempSpecificationNameList.includes(specification.specification_name)) {
        this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-规格名称重复！`;
        result = false;
        return;
      } else if (!specification.base_num && !specification.base_wax_num) {
        this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-规格配置之和至少等于1！`;
        result = false;
        return;
      } else if (!specification.sale_fee) {
        this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-售价应大于0！`;
        result = false;
        return;
      } else if (specification.original_fee < specification.sale_fee) {
        this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-售价应小于等于原价！`;
        result = false;
        return;
      } else if (!specification.valid_date_type) {
        this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-请选择有效期类型！`;
        result = false;
        return;
      } else {
        if (specification.valid_date_type === 1 && !specification.valid_period) {
          this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-有效期时长应大于0！`;
          result = false;
          return;
        } else if (specification.valid_date_type === 2) {
          if (!specification.valid_date_start) {
            this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-请选择有效期开始日期！`;
            result = false;
            return;
          } else if (!specification.valid_date_end) {
            this.specificationErrMsg = `${car_name}-第${index + 1}条规格信息-请选择有效期结束日期！`;
            result = false;
            return;
          }
        }
      }
      if (result) {
        this.tempSpecificationNameList.push(specification.specification_name);
      }
    });
    this.tempSpecificationNameList = [];
    return result;
  }
}
