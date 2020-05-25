import { Injectable } from '@angular/core';
import { EntityBase } from '../../../utils/z-entity';
import { environment } from '../../../environments/environment';
import { HttpService, LinkResponse } from '../../core/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AccessoryEntity, ProjectEntity } from '../accessory-library/accessory-library.service';
import { WarehouseEntity, SupplierEntity } from '../supplier-management/supplier-management-http.service';

export class SearchParams extends EntityBase {
  public status = ''; // 	int	F	营业状态 1.营业 2.不营业
  public service_type = ''; // int	F 服务类型 1:保养服务 2:救援服务 3:洗车服务 4:上门保养
  public repair_shop_name = ''; // 	F	汽修店名称
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 供货配置筛选参数
export class SupplyConfigParams extends EntityBase {
  public accessory_name: string = undefined; // 配件名称
  public supply_type = 4; // 供货方式 1:第三方供应商  2:门店自供 3空 4全部
  public project_id = ''; // 保养项目ID(机油ID/机油滤清器ID) "xxx"
  public supplier_id = ''; // 供货商ID
  public warehouse_id = ''; // 供应仓库ID
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 设置供应商
export class SetSupplyConfigParams extends EntityBase {
  public supply_type: any = ''; // 供货方式 1:第三方供应商 2:门店自供
  public accessory_ids: string = undefined; // 配件ID集合 "xxx,xxx"
  public supplier_id = ''; // 供应商ID
  public warehouse_id = ''; // 供应仓库ID
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

// 编辑汽修店基本信息
export class EditRepairShopParams extends EntityBase {
  public door_run_start_time: number = null; // 上门服务开始时间 默认:空
  public door_run_end_time: number = null; // 上门服务结束时间 默认:空
  public service_telephone = ''; // T 此为搭电换胎通知手机号
  public battery_telephone = ''; // T 此为换电瓶通知手机号
  public service_type: Array<number> = []; // 服务类型 1:保养服务 2:救援服务 3:洗车服务
}

// 洗车服务
export class WashCarEntity extends EntityBase {
  public wash_car_id: string = undefined; // 汽修店洗车相关 主键
  public wash_car_tags: Array<any> = []; // 洗车标签
  public start_time: number = null; // 汽修店洗车营业开始时间
  public end_time: number = null; // 汽修店洗车营业结束时间
  public wash_car_telephone = ''; // 客服电话(汽修店洗车客服电话)
  public shop_instruction = ''; // 店铺简介
  public repair_shop: RepairShopEntity = undefined; // 汽修店
  public service_num: number = undefined; // 已服务次数
  public rank = '1'; // integer	T	门店等级

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'repair_shop') {
      // tslint:disable-next-line: no-use-before-declare
      return RepairShopEntity;
    }
    return null;
  }

  public toEditJson(): any {
    const json = this.json();
    delete json.wash_car_id;
    delete json.repair_shop;
    delete json.service_num;
    return json;
  }
}

// 到店保养服务
export class MaintainInfoEntity extends EntityBase {
  public repair_maintain_info_id: string = undefined; // 汽修店洗车相关 主键
  public maintain_tags: Array<any> = []; // 洗车标签
  public start_time: number = null; // 汽修店洗车营业开始时间
  public end_time: number = null; // 汽修店洗车营业结束时间
  public maintain_telephone = ''; // 客服电话(汽修店到店保养客服电话)
  public shop_instruction = ''; // 店铺简介
  public repair_shop: RepairShopEntity = undefined; // 汽修店
  public service_num: number = undefined; // 已服务次数

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'repair_shop') {
      // tslint:disable-next-line: no-use-before-declare
      return RepairShopEntity;
    }
    return null;
  }

  public toEditJson(): any {
    const json = this.json();
    delete json.repair_maintain_info_id;
    delete json.repair_shop;
    delete json.service_num;
    return json;
  }
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
  public service_type: Array<number> = []; // 服务类型 1:保养服务 2:救援服务 3:洗车服务 4:上门保养
  public rescue_config: RescueConfig = undefined; // 救援配置
  public wash_car: WashCarEntity = undefined; // 洗车相关
  public maintain_info: MaintainInfoEntity = undefined; // 到店保养服务
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
    if (propertyName === 'wash_car') {
      return WashCarEntity;
    }
    if (propertyName === 'maintain_info') {
      return MaintainInfoEntity;
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
  public accessory: AccessoryEntity = undefined; // 配件
  public supply_type: number = undefined; // 供货方式 1:第三方供应商  2:门店自供
  public supplier: SupplierEntity = undefined; // 供应商
  public warehouse: WarehouseEntity = undefined;  // 仓库
  public created_time: number = undefined; // 创建时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'repair_shop') {
      return RepairShopEntity;
    }
    if (propertyName === 'accessory') {
      return AccessoryEntity;
    }
    if (propertyName === 'supplier') {
      return SupplierEntity;
    }
    if (propertyName === 'warehouse') {
      return WarehouseEntity;
    }
    return null;
  }
}

// 配件信息
export class AccessoryInfoEntity extends AccessoryEntity {
  public supply_config: SupplyConfigEntity = undefined;
  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'supply_config') {
      return SupplyConfigEntity;
    }
    return null;
  }
}

// 技师信息
export class MechanicEntity extends EntityBase {
  public mechanic_id: string = undefined; // 	string	PK
  public repair_shop_id: string = undefined; // 	string	汽修店id
  public name: string = undefined; // 	string	姓名
  public tags: string = undefined; // 	string	标签
  public image: string = undefined; // 	string	图片
  public type = '保养技师'; // 	string	类型
  public intro: string = undefined; // 	string	简介
  public created_time: number = undefined; // 创建时间
  public updated_time: number = undefined; // 更新时间
}

export class SupplyConfigLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<AccessoryInfoEntity> {
    const tempList: Array<AccessoryInfoEntity> = [];
    results.forEach(res => {
      tempList.push(AccessoryInfoEntity.Create(res));
    });
    return tempList;
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

export class TechnicianLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<MechanicEntity> {
    const tempList: Array<MechanicEntity> = [];
    results.forEach(res => {
      tempList.push(MechanicEntity.Create(res));
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
  public requestEditRepairShops(repair_shop_id: string, params: EditRepairShopParams): Observable<HttpResponse<any>> {
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
   * 获取救援服务配置
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
  public requestSupplyConfigList(searchParams: SupplyConfigParams, repair_shop_id: string): Observable<SupplyConfigLinkResponse> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}/accessories`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new SupplyConfigLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求汽修店列表
   * @param string url linkUrl
   * @returns Observable<SupplyConfigLinkResponse>
   */
  public continueSupplyConfigList(url: string): Observable<SupplyConfigLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new SupplyConfigLinkResponse(res)));
  }

  /**
   * 设置供货方式
   * @param repair_shop_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestSetSupplyConfig(repair_shop_id: string, params: SetSupplyConfigParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}/supply_config`;
    return this.httpService.put(httpUrl, params.json());
  }

  /**
   * 编辑洗车相关
   * @param repair_shop_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditWashInfo(repair_shop_id: string, params: WashCarEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/repair_shops/${repair_shop_id}/wash_car_info`;
    return this.httpService.put(httpUrl, params.toEditJson());
  }

  /**
   * 编辑到店保养服务
   * @param repair_shop_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditMaintainInfo(repair_shop_id: string, params: MaintainInfoEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/repair_shops/${repair_shop_id}/maintain_info`;
    return this.httpService.put(httpUrl, params.toEditJson());
  }

  /**
   * 获取所有供应商
   * @param repair_shop_id 参数
   */
  public requestSupplierListData(): Observable<Array<SupplierEntity>> {
    const httpUrl = `${this.domain}/admin/suppliers/all`;
    return this.httpService.get(httpUrl).pipe(map(result => {
      const tempList: Array<SupplierEntity> = [];
      result.body.forEach(res => {
        tempList.push(SupplierEntity.Create(res));
      });
      return tempList;
    }));
  }

  /**
   * 获取供应商下所有仓库
   * @param supplier_id 参数
   */
  public requestWarehouseListData(supplier_id: string, status: any = ''): Observable<Array<WarehouseEntity>> {
    const httpUrl = `${this.domain}/admin/suppliers/${supplier_id}/warehouses/all`;
    const params = status ? {
      status
    } : '';
    return this.httpService.get(httpUrl, params).pipe(map(result => {
      const tempList: Array<WarehouseEntity> = [];
      result.body.forEach(res => {
        tempList.push(WarehouseEntity.Create(res));
      });
      return tempList;
    }));
  }

  /**
   * 获取项目列表
   */
  public requestProjectListData(): Observable<Array<ProjectEntity>> {
    const httpUrl = `${this.domain}/admin/projects/all`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      const tempList: Array<ProjectEntity> = [];
      res.body.forEach(data => {
        tempList.push(ProjectEntity.Create(data));
      });
      return tempList;
    }));
  }

  /**
   * 获取汽修店技师列表
   * @param searchParams 条件检索参数
   */
  public requestTechnicianList(repair_shop_id: string): Observable<TechnicianLinkResponse> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}/mechanics`;
    const param = {page_size: 45, page_num: 1};
    return this.httpService.get(httpUrl, param).pipe(map(res => new TechnicianLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求汽修店技师列表
   * @param string url linkUrl
   * @returns Observable<TechnicianLinkResponse>
   */
  public continueTechnicianList(url: string): Observable<TechnicianLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new TechnicianLinkResponse(res)));
  }

  /**
   * 添加汽修店技师
   * @param repair_shop_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestCreateTechnician(repair_shop_id: string, params: any): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}/mechanics`;
    return this.httpService.post(httpUrl, params);
  }

  /**
   * 编辑汽修店技师
   * @param mechanic_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditTechnician(repair_shop_id: string, mechanic_id: string, params: any): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}/mechanics/${mechanic_id}`;
    return this.httpService.put(httpUrl, params);
  }

  /**
   * 删除汽修店技师
   * @param mechanic_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestDelTechnician(repair_shop_id: string, mechanic_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}/mechanics/${mechanic_id}`;
    return this.httpService.delete(httpUrl);
  }
}
