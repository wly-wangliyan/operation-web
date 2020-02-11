import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../core/http.service';
import { environment } from '../../../environments/environment';
import { ParamEntity } from '../project-management/project-management-http.service';
import { CarSeriesEntity } from '../vehicle-management/vehicle-management-http.service';

// 规格实体
export class SpecificationEntity extends EntityBase {
  public specification_id: string = undefined; // string	规格id-主键
  public name: string = undefined; // string	名称
  public accessory: AccessoryEntity = undefined; // object	配件对象 Accessory
  public image: string = undefined; // string	图片
  public imageList = []; // arr	图片数组
  public battery_model: string = undefined; // string	配件型号
  public accessory_model: string = undefined; // string	型号(蓄电池)
  public content: string = undefined; // string	容量(蓄电池)/净含量(机油)
  public original_balance_fee: number = undefined; // 尾款原价(蓄电池) 单位:分
  public sale_balance_fee: number = undefined; // 尾款现价(蓄电池) 单位:分
  public original_fee: number = undefined; // 原价(机滤、机油) 单位：分
  public settlement_fee: number = undefined; // 结算价(机滤、机油) 单位：分
  public sale_fee: number = undefined; // 售价(机滤、机油) 单位：分
  public store: number = undefined; // integer	库存
  public sale_num: number = undefined; // integer	销量
  public is_deleted = false; // bool	是否删除
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
  public time = new Date().getTime();

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'accessory') {
      // tslint:disable-next-line: no-use-before-declare
      return AccessoryEntity;
    }
    return null;
  }
}

// 项目实体
export class ProjectEntity extends EntityBase {
  public project_id: string = undefined; // string	项目id - 主键
  public project_number: string = undefined; // string	项目编号
  public project_name: string = undefined; // string	项目名称
  public related_project_name: string = undefined; // string	配套项目名称
  public specification: SpecificationEntity = undefined; // json	规格 { 'type': 1, 'name': 'xxx', 'unit': 'xxx' } 1: 数值
  public description: string = undefined; // string	描述
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'specification') {
      return SpecificationEntity;
    }
    return null;
  }
}

// 品牌实体
export class AccessoryBrandEntity extends EntityBase {
  public accessory_brand_id: string = undefined; // string	配件品牌id - 主键
  public brand_name: string = undefined; // string	配件品牌名称
  public sign_image: string = undefined; // string	配件品牌标志图片
  public introduce: string = undefined; // string	简介
  public is_deleted: boolean = undefined; // bool	是否删除
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
}

// 机油参数实体
export class AccessoryParamsEntity extends EntityBase {
  public oil_num = ''; // string	机油标号
  public oil_type = ''; // int 机油类别 1：全合成 2：半合成 3：矿物质
  public oil_api = ''; // string	api等级
  public oil_place: string = undefined; // string	商品产地
  public oil_expire: string = undefined; // string	保质期
}

// 机滤参数实体
export class PriceInfoEntity extends EntityBase {
  public original_fee: number = undefined; // float	机滤原价
  public settlement_fee: number = undefined; // float 机滤结算价
  public sale_fee: number = undefined; // float	机滤售价
  public store: number = undefined; // float	机滤库存

  constructor(source?: SpecificationEntity) {
    super();
    if (source) {
      this.original_fee = source.original_fee;
      this.settlement_fee = source.settlement_fee;
      this.sale_fee = source.sale_fee;
      this.store = source.store;
    }
  }

  public toEditJson(): any {
    const json = this.json();
    json.original_fee = Math.round(json.original_fee * 100);
    json.settlement_fee = Math.round(json.settlement_fee * 100);
    json.sale_fee = Math.round(json.sale_fee * 100);
    return json;
  }
}

// 配件实体
export class AccessoryEntity extends EntityBase {
  public accessory_id: string = undefined; // string	配件id - 主键
  public accessory_name: string = undefined; // tring	配件名称
  public accessory_images: string = undefined; // string	图片 多个逗号分隔
  public operation_telephone: string = undefined; // string	运营手机号
  public accessory_imagesList: Array<any> = []; // array	图片数组
  public car_series_list: Array<CarSeriesEntity> = []; // array	车系数组
  public project: ProjectEntity = undefined; // 项目对象 Project
  public accessory_brand: AccessoryBrandEntity = undefined; // object	配件品牌对象 AccessoryBrand
  public specification_info: Array<SpecificationEntity> = []; // object	规格 Specification
  public accessory_params: AccessoryParamsEntity = undefined; // json	机油参数
  public price_info: PriceInfoEntity = undefined; // json	机滤参数
  public detail: string = undefined; // string	图文详情
  public car_series: number = undefined; // object	车系对象 多对多
  public real_prepaid_fee: number = undefined; // float	实际预付价 单位：分
  public right_prepaid_fee: number = undefined; // float	应付预付价 单位：分
  public is_deleted: boolean = undefined; // bool	是否删除
  public sale_status: boolean = undefined; // integer	销售状态 1：在售 2：停售
  public min_right_balance: number = undefined; // integer	最小原价
  public max_right_balance: number = undefined; // integer	最大原价
  public min_buy_price: number = undefined; // integer	最小结算价
  public max_buy_price: number = undefined; // integer	最大结算价
  public min_real_balance: number = undefined; // integer	最小售价
  public max_real_balance: number = undefined; // integer	最大售价
  public sale_num: number = undefined; // integer	销量
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
  public supply_type: number = undefined; // 供应方式  1:第三方供应商 2:门店自供

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'project') {
      return ProjectEntity;
    } else if (propertyName === 'accessory_brand') {
      return AccessoryBrandEntity;
    } else if (propertyName === 'specification_info') {
      return SpecificationEntity;
    } else if (propertyName === 'accessory_params') {
      return AccessoryParamsEntity;
    } else if (propertyName === 'price_info') {
      return PriceInfoEntity;
    } else if (propertyName === 'car_series_list') {
      return CarSeriesEntity;
    }
    return null;
  }
}

export class AccessoryLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<AccessoryEntity> {
    const tempList: Array<AccessoryEntity> = [];
    results.forEach(res => {
      tempList.push(AccessoryEntity.Create(res));
    });
    return tempList;
  }
}

export class ProjectLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ProjectEntity> {
    const tempList: Array<ProjectEntity> = [];
    results.forEach(res => {
      tempList.push(ProjectEntity.Create(res));
    });
    return tempList;
  }
}

// 查询参数
export class SearchParams extends EntityBase {
  public project_id = ''; // string	F	所属项目
  public accessory_brand_id = ''; // string	F	配件品牌
  public accessory_name: string = undefined; // string	F	配件名称
  public accessory_id: string = undefined; // string	F	配件id
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 配件库参数
export class SearchAccessoryParams extends EntityBase {
  public project_id: string = undefined; // string	F	所属项目Id
  public project_name: string = undefined; // string	F	所属项目名称
  public accessory_name: string = undefined; // string	F	配件名称
  public accessory_images: string = undefined; // string	T	图片 多个逗号分隔
  public operation_telephone: string = undefined; // string	T	运营手机号(蓄电池)
  public accessory_brand_name: string = undefined; // string	F	配件品牌名称
  public accessory_brand_id: string = undefined; // string	F	配件品牌id
  public real_prepaid_fee: number = undefined; // float	F	实际预付费(蓄电池)  单位：分
  public right_prepaid_fee: number = undefined; // float	F	应付预付费(蓄电池)  单位：分
  public accessory_params: AccessoryParamsEntity = undefined; // json	机油参数
  public price_info: PriceInfoEntity = undefined; // json	机滤参数
  public specifications: Array<SpecificationEntity> = undefined; // object	规格 Specification
  public detail: string = undefined; // string	T	图文详情 无：''
  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'specifications') {
      return SpecificationEntity;
    } else if (propertyName === 'accessory_params') {
      return AccessoryParamsEntity;
    } else if (propertyName === 'price_info') {
      return PriceInfoEntity;
    } else if (propertyName === 'battery_specification') {
      return SpecificationEntity;
    }
    return null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AccessoryLibraryService {
  private domain = environment.STORE_DOMAIN; // 保养域名

  constructor(private httpService: HttpService) {}

  /**
   * 获取配件库列表
   * @param searchParams 条件检索参数
   * @returns Observable<AccessoryLinkResponse>
   */
  public requestAccessoryListData(
    searchParams: SearchParams
  ): Observable<AccessoryLinkResponse> {
    const httpUrl = `${this.domain}/accessories`;
    return this.httpService
      .get(httpUrl, searchParams.json())
      .pipe(map(res => new AccessoryLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求服务费列表
   * @param string url linkUrl
   * @returns Observable<AccessoryLinkResponse>
   */
  public continueAccessoryistData(
    url: string
  ): Observable<AccessoryLinkResponse> {
    return this.httpService
      .get(url)
      .pipe(map(res => new AccessoryLinkResponse(res)));
  }

  /**
   * 修改配件的销售状态
   * @param accessory_id string	T	服务费ID
   * @param sale_status boolean	T	销售状态 默认：False 停售
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateStatusData(
    accessory_id: string,
    sale_status: boolean
  ): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/accessories/${accessory_id}/sale_status`;
    return this.httpService.patch(httpUrl, { sale_status });
  }

  /**
   * 获取配置库详情
   * @param accessory_id string	T	配件库ID
   * @returns Observable<AccessoryEntity>
   */
  public requestAccessoryDetailData(
    accessory_id: string
  ): Observable<AccessoryEntity> {
    const httpUrl = `${this.domain}/accessories/${accessory_id}`;
    return this.httpService
      .get(httpUrl)
      .pipe(map(res => AccessoryEntity.Create(res.body)));
  }

  /**
   * 获取项目列表
   * @returns Observable<ProjectLinkResponse>
   */
  public requestProjectListData(): Observable<ProjectLinkResponse> {
    const httpUrl = `${this.domain}/admin/projects/all`;
    return this.httpService
      .get(httpUrl)
      .pipe(map(res => new ProjectLinkResponse(res)));
  }

  /**
   * 获取项目详情--取规格名称
   * @param project_id string	T	项目ID
   * @returns Observable<ProjectEntity>
   */
  public requestProjectDetailData(
    project_id: string
  ): Observable<ProjectEntity> {
    const httpUrl = `${this.domain}/admin/projects/${project_id}`;
    return this.httpService
      .get(httpUrl)
      .pipe(map(res => ProjectEntity.Create(res.body)));
  }

  /**
   * 新建配件库
   * @param params SearchAccessoryParams 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestAddAccessoryData(
    params: SearchAccessoryParams
  ): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/accessories`;
    return this.httpService.post(httpUrl, params);
  }

  /**
   * 编辑配件库
   * @param accessory_id 配件id
   * @param params SearchAccessoryParams 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateAccessoryData(
    params: SearchAccessoryParams,
    accessory_id: string
  ): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/accessories/${accessory_id}`;
    return this.httpService.put(httpUrl, params);
  }

  /**
   * 删除配件
   * @param accessory_id 配件id
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteAccessoryData(
    accessory_id: string
  ): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/accessories/${accessory_id}`;
    return this.httpService.delete(httpUrl);
  }

  /**
   * 推荐设置
   * @param accessory_id 配件id
   * @param car_series_ids string 车系
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateRecommendData(
    car_series_ids: string,
    accessory_id: string
  ): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/accessories/${accessory_id}/car_series`;
    return this.httpService.patch(httpUrl, { car_series_ids });
  }

  /**
   * 获取机油参数配置
   * @param project_id 项目id
   * @returns Observable<Array<ParamEntity>>
   */
  public requestProjectParamsData(
    project_id: string
  ): Observable<Array<ParamEntity>> {
    const httpUrl = `${this.domain}/admin/projects/${project_id}/params`;
    return this.httpService.get(httpUrl).pipe(
      map(res => {
        const tempList: Array<ParamEntity> = [];
        res.body.forEach(data => {
          tempList.push(ParamEntity.Create(data));
        });
        return tempList;
      })
    );
  }
}
