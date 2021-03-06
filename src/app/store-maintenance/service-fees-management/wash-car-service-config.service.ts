import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators/map';
import { HttpResponse } from '@angular/common/http';
import { HttpService } from '../../core/http.service';
import { environment } from '../../../environments/environment';
import { RepairShopEntity } from '../garage-management/garage-management.service';

// 洗车服务配置
export class WashCarServiceConfigEntity extends EntityBase {
  public wash_car_service_config_id: string = undefined; // 洗车服务配置ID 主键
  public service_introduce: string = undefined; // string	服务说明
  public min_sale_fee: number = undefined; // float	起售价格 单位:分
  public refund_switch: number = undefined; // int 1开 2关
  public specification_info: Array<WashCarSpecificationEntity> = []; // 规格
  public base_price_info: Array<BasePriceEntity> = []; // 基础价格
  public tags: Array<any> = []; // array	洗车标签 最多10个 标签长度10
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
  public standard_price: number = undefined; // 平台标准价 单位：分
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
    json.original_unit_fee = Math.round(json.original_unit_fee * 100);
    json.standard_price = Math.round(json.standard_price * 100);
    json.buy_unit_fee = Math.round(json.buy_unit_fee * 100);
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
    json.sale_fee = Math.round(json.sale_fee * 100);
    json.valid_date_start = json.valid_date_start ? json.valid_date_start / 1000 : '';
    json.valid_date_end = json.valid_date_end ? json.valid_date_end / 1000 : '';
    return json;
  }
}

// 洗车活动实体
export class WashCarActivityEntity extends EntityBase {
  public wash_car_activity_id: string = undefined;
  public wash_car_specification: WashCarSpecificationEntity = undefined; // 洗车规格
  public period_type: number = undefined; // 有效期类型 1: 每日 2：每周 3：每月 4：自定义
  public week_day: number | string = ''; // int 周(1-7 代表周一到周日)--period_type=2 必填
  public month_day: number = undefined; // 月(1-28号)---period_type=3 必填
  public valid_time_start: any = undefined; // 活动开始时间 单位：分 period_type=1/2/3 必填
  public valid_time_end: any = undefined; // 活动结束时间 单位：分 period_type=1/2/3 必填
  public valid_date_start: any = undefined; // 活动开始日期 period_type=4 必填
  public valid_date_end: any = undefined; // 活动结束日期 period_type=4 必填
  public activity_fee: number = undefined; // 活动价格 单位：分
  public activity_num: number = undefined; // 活动数量
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间
  public is_deleted = false; // 是否删除
  public identifier: number = undefined; // dom防重复标识符

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'wash_car_specification') {
      return WashCarSpecificationEntity;
    }
    return null;
  }

  public toEditJson() {
    const json = this.json();
    json.activity_fee = Math.round(json.activity_fee * 100);
    json.week_day = json.week_day || null;
    json.month_day = json.month_day || null;
    json.valid_time_start = json.valid_time_start >= 0 ? json.valid_time_start : null;
    json.valid_time_end = json.valid_time_end >= 0 ? json.valid_time_end : null;
    json.valid_date_start = json.valid_date_start || null;
    json.valid_date_end = json.valid_date_end || null;
    delete json.updated_time;
    delete json.created_time;
    delete json.identifier;
    return json;
  }
}

// 新建／编辑 洗车规格活动
export class EditWashCarActivityParams extends EntityBase {
  public wash_car_activities: Array<WashCarActivityEntity> = [];

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'wash_car_activities') {
      return WashCarActivityEntity;
    }
    return null;
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
      result.body.forEach((res: RepairShopEntity) => {
        tempList.push(RepairShopEntity.Create(res));
      });
      return tempList;
    }));
  }

  /**
   * 获取洗车服务活动列表
   */
  public requestWashCarActivitiesData(wash_car_specification_id: string): Observable<Array<WashCarActivityEntity>> {
    const httpUrl = `${this.domain}/admin/wash_car_specifications/${wash_car_specification_id}/wash_car_activities`;
    return this.httpService.get(httpUrl).pipe(map(result => {
      const tempList: Array<WashCarActivityEntity> = [];
      result.body.forEach((res: WashCarActivityEntity) => {
        tempList.push(WashCarActivityEntity.Create(res));
      });
      return tempList;
    }));
  }

  /**
   * 新建洗车活动
   * @param wash_car_specification_id 洗车规格Id
   * @param editParams EditWashCarActivityParams
   * @returns Observable<HttpResponse<any>>
   */
  public requestAddWashCarActivityData(
    wash_car_specification_id: string, editParams: EditWashCarActivityParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/wash_car_specifications/${wash_car_specification_id}/wash_car_activities`;
    return this.httpService.post(httpUrl, editParams);
  }

  /**
   * 新建洗车活动
   * @param wash_car_specification_id 洗车规格Id
   * @param editParams EditWashCarActivityParams
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditWashCarActivityData(
    wash_car_specification_id: string, editParams: EditWashCarActivityParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/wash_car_specifications/${wash_car_specification_id}/wash_car_activities`;
    return this.httpService.put(httpUrl, editParams);
  }
}
