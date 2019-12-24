import { Injectable } from '@angular/core';
import { EntityBase } from '../../../utils/z-entity';
import { environment } from '../../../environments/environment';
import { HttpService, LinkResponse } from '../../core/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export class SearchParams extends EntityBase {
  public status = ''; // 	int	F	营业状态 1.营业 2.不营业
  public repair_shop_name = ''; // 	F	汽修店名称
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

/*
* 汽修企业
* */
export class RepairCompanyEntity extends EntityBase {
  public repair_shop_id: string = undefined; // 	汽修店ID 主键
  public repair_company_id: string = undefined; // 汽修企业ID 主键
  public repair_company_name: string = undefined; // 汽修企业名称
  public created_time: number = undefined; // 创建时间
  public updated_time: number = undefined; // 更新时间
}

export class EditRepairShopParams extends EntityBase {
  public door_run_start_time: number = null; // 上门服务开始时间 默认:空
  public door_run_end_time: number = null; // 上门服务结束时间 默认:空
  public service_telephone = ''; // T 此为搭电换胎通知手机号
  public battery_telephone = ''; // T 此为换电瓶通知手机号
}

/*
* 汽修店
* */
export class RepairShopEntity extends EntityBase {
  public repair_shop_id: string = undefined; // 	汽修店ID 主键
  public repair_company: RepairCompanyEntity = undefined; // 	所属企业 外键
  public repair_shop_name: string = undefined; // 	汽修店商家名称
  public images: Array<any> = undefined; // 	汽修店图片/商家图片
  public contacts: string = undefined; // 	联系人
  public telephone: string = undefined; // 联系电话
  public province: string = undefined; // 省
  public city: string = undefined; // 市
  public district: string = undefined; // 区
  public address: string = undefined; // 地址
  public lat: string = undefined; // 经度
  public lon: string = undefined; // 纬度
  public location = undefined; // 	位置点
  public door_run_start_time: number = null; // 上门服务开始时间 默认:空
  public door_run_end_time: number = null; // 上门服务结束时间 默认:空
  public shop_start_time: number = null; // 到店服务开始时间 默认:空
  public shop_end_time: number = null; // 到店服务结束时间 默认:空
  public service_telephone: string = undefined; // T 此为搭电换胎通知手机号
  public battery_telephone: string = undefined; // T 此为换电瓶通知手机号
  public status: number = undefined; // 营业状态 1:营业 2:关闭
  public serve_type: number = undefined; // 服务类型 1:保养服务 2:救援服务
  public rescue_config: RescueConfig = undefined; // 救援配置
  public created_time: number = undefined; // 创建时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'repair_company') {
      return RepairCompanyEntity;
    }
    if (propertyName === 'rescue_config') {
      // tslint:disable-next-line: no-use-before-declare
      return RescueConfig;
    }
    return null;
  }
}

/*
* 救援配置
* */
export class RescueConfig extends EntityBase {
  public rescue_config_id: string = undefined; // 救援配置ID 主键
  public rescue_service_type: string = undefined; // 救援服务类型 1：搭电 2：换胎
  public repair_shop: RepairShopEntity = undefined; // 	汽修店 外键
  public service_start_time: number = undefined; // 	服务开始时间 默认:空
  public service_end_time: number = undefined; // 服务结束时间 默认:空
  public rescue_range = ''; // 救援范围
  public is_deleted: boolean = undefined;  // 是否删除
  public created_time: number = undefined; // 创建时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'repair_shop') {
      return RepairShopEntity;
    }
    return null;
  }
}

// 供货配置实体
export class SupplyConfigEntity extends EntityBase {
  public supply_config_id: string = undefined; // 救援配置ID 主键
  public repair_shop: RepairShopEntity = undefined; // 	汽修店 外键
  public accessory: number = undefined; // 	服务开始时间 默认:空
  public supply_type: number = undefined; // 供货方式 1:门店自供 2:第三方供应商
  public supplier = ''; // 供应商
  public warehouse: boolean = undefined;  // 仓库
  public created_time: number = undefined; // 创建时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'repair_shop') {
      return RepairShopEntity;
    }
    return null;
  }
}

export class RepairShopsLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<RepairShopEntity> {
    const tempList: Array<RepairShopEntity> = [];
    results.forEach(res => {
      tempList.push(RepairShopEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GarageManagementService {

  private domain = environment.STORE_DOMAIN; // 商城域名

  constructor(private httpService: HttpService) { }


  /**
   * 获取汽修店列表
   * @param searchParams 条件检索参数
   */
  public requestRepairShopsList(searchParams: SearchParams): Observable<RepairShopsLinkResponse> {
    const httpUrl = `${this.domain}/repair_shops`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new RepairShopsLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求汽修店列表
   * @param string url linkUrl
   * @returns Observable<BusinessLinkResponse>
   */
  public continueRepairShopsList(url: string): Observable<RepairShopsLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new RepairShopsLinkResponse(res)));
  }

  /**
   * 获取汽修店详情
   * @param repair_shop_id 汽修店ID
   * @returns Observable<GoodsOrderEntity>
   */
  public requestRepairShopsDetail(repair_shop_id: string): Observable<RepairShopEntity> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => RepairShopEntity.Create(res.body)));
  }

  /**
   * 修改汽修店营业状态
   * @param repair_shop_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestRepairShopsStatus(repair_shop_id: string, params: any): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}/status`;
    return this.httpService.patch(httpUrl, params);
  }

  /**
   * 编辑汽修店
   * @param repair_shop_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditRepairShops(repair_shop_id: string, params: any): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}`;
    return this.httpService.put(httpUrl, params);
  }

  /**
   * 编辑汽修店救援配置
   * @param repair_shop_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditRescueConfig(repair_shop_id: string, params: any): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}/rescue_config`;
    return this.httpService.put(httpUrl, params);
  }

  /**
   * 获取救援服务卑职
   * @param repair_shop_id 参数
   */
  public requestRescueConfigData(repair_shop_id: string): Observable<Array<RescueConfig>> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}/rescue_config`;
    return this.httpService.get(httpUrl).pipe(map(result => {
      const tempList: Array<RescueConfig> = [];
      result.body.forEach(res => {
        tempList.push(RescueConfig.Create(res));
      });
      return tempList;
    }));
  }

  /**
   * 获取供货配置列表
   * @param searchParams 条件检索参数
   */
  public requestSupplyConfigList(searchParams: SearchParams, repair_shop_id: string): Observable<RepairShopsLinkResponse> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}/accessories`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new RepairShopsLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求汽修店列表
   * @param string url linkUrl
   * @returns Observable<BusinessLinkResponse>
   */
  public continueSupplyConfigList(url: string): Observable<RepairShopsLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new RepairShopsLinkResponse(res)));
  }
}
