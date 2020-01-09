import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators/map';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../core/http.service';
import { environment } from '../../../environments/environment';
import { RepairShopEntity } from '../garage-management/garage-management.service';

// 洗车服务配置
export class WashCarServiceConfigEntity extends EntityBase {
  public wash_car_service_config_id: string = undefined; // 洗车服务配置ID 主键
  public service_introduce: string = undefined; // string	服务说明
  public specification_info: Array<WashCarSpecificationEntity> = []; // 规格
  public base_price_info: Array<BasePriceEntity> = []; // 基础价格
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'specification_info') {
      // tslint:disable-next-line: no-use-before-declare
      return WashCarSpecificationEntity;
    }
    if (propertyName === 'base_price_info') {
      // tslint:disable-next-line: no-use-before-declare
      return BasePriceEntity;
    }
    return null;
  }
}

// 基础价格
export class BasePriceEntity extends EntityBase {
  public base_price_id: string = undefined; // 基础价格ID
  public wash_car_service_config: WashCarServiceConfigEntity = undefined; // 洗车服务配置对象
  public service_type: number = undefined; // 服务类型 1：标准洗车1次 2：标准洗车1次+打蜡1次
  public car_type: number = undefined; // 车型 1: 5座小型车 2：SUV/MPV
  public original_unit_fee: number = undefined; // 原价单价 单位：分
  public buy_unit_fee: number = undefined; // 结算单价 单位：分
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'wash_car_service_config') {
      return WashCarServiceConfigEntity;
    }
    return null;
  }

  public toEditJson() {
    const json = this.clone().json();
    json.original_unit_fee = Math.ceil(json.original_unit_fee * 100);
    json.buy_unit_fee = Math.ceil(json.buy_unit_fee * 100);
    return json;
  }
}

// 洗车规格
export class WashCarSpecificationEntity extends EntityBase {
  public wash_car_specification_id: string = undefined; // 洗车规格ID 主键
  public wash_car_service_config: WashCarServiceConfigEntity = undefined; // 洗车服务配置对象
  public car_type: number = undefined; // 车型 1: 5座小型车 2：SUV/MPV
  public specification_name: string = undefined; // 规格名称
  public base_num: number = undefined; // 标准洗车次数
  public base_wax_num: number = undefined; // 标准洗车+打蜡次数
  public original_fee = 0; // 原价=标准洗车原价×标准洗车次数+（标准洗车+打蜡次数原价）×（标准洗车+打蜡次数）
  public sale_fee: number = undefined; // 售价 单位：分
  public store: number = undefined; // 库存
  public sale_num: number = undefined; // 销量
  public valid_date_type: number = undefined; // 有效期类型 1：下单日期起有效 2：固定日期有效
  public valid_date_start: any = undefined; // 有效期开始日期---2：固定日期有效
  public valid_date_end: any = undefined; // 有效期结束日期---2：固定日期有效
  public valid_period: number = undefined; // 有效期---1：下单日期起有效
  public valid_period_unit: string = undefined; // 有效期单位---1：下单日期起有效 day:天 month：月 year：年
  public status: number = undefined; // 规格开关 1:开启 2:关闭
  public is_deleted = false; // 是否删除
  public time: number = undefined; // 时间戳
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'wash_car_service_config') {
      return WashCarServiceConfigEntity;
    }
    return null;
  }

  public toEditJson() {
    const json = this.clone().json();
    json.sale_fee = Math.ceil(json.sale_fee * 100);
    json.valid_date_start = json.valid_date_start ? json.valid_date_start / 1000 : '';
    json.valid_date_end = json.valid_date_end ? json.valid_date_end / 1000 : '';
    return json;
  }
}


@Injectable({
  providedIn: 'root'
})
export class WashCarServiceConfigService {

  private domain = environment.STORE_DOMAIN; // 保养域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取洗车服务配置详情
   * @returns Observable<WashCarServiceConfigEntity>
   */
  public requestWashCarServiceConfigData(): Observable<WashCarServiceConfigEntity> {
    const httpUrl = `${this.domain}/admin/wash_car_service_config`;
    return this.httpService.get(httpUrl).pipe(map(res => WashCarServiceConfigEntity.Create(res.body)));
  }

  /**
   * 编辑洗车服务配置
   * @param editParams WashCarServiceConfigEntity
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditWashCarServiceConfigData(editParams: WashCarServiceConfigEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/wash_car_service_config`;
    return this.httpService.put(httpUrl, editParams);
  }

  /**
   * 修改规格开关
   * @param wash_car_specification_id ID
   * @param status number 启用状态(状态,1:开启,2:关闭)
   * @returns Observable<HttpResponse<any>>
   */
  public requestChangeStatus(wash_car_specification_id: string, status: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/wash_car_specifications/${wash_car_specification_id}/status`;
    const body = {
      status
    };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 获取洗车服务通用店铺列表
   */
  public requestRepairShopData(): Observable<Array<RepairShopEntity>> {
    const httpUrl = `${this.domain}/admin/repair_shops/wash_car`;
    return this.httpService.get(httpUrl).pipe(map(result => {
      const tempList: Array<RepairShopEntity> = [];
      result.body.forEach(res => {
        tempList.push(RepairShopEntity.Create(res));
      });
      return tempList;
    }));
  }
}
